const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const userService = require("../../services/v1/userService");
const authService = require("../../services/v1/authService");
const emailSender = require("../../utils/emailTransporter");
const tokenGenerator = require("../../utils/jwt");
const {
  getFileUrl,
  saveFileInS3,
  deleteFilefromS3,
} = require("../../database/aws_s3");

const USERS_PER_PAGE = 3;
/**
 * Get data of a specific user with id
 * @function
 * @name getAllUsers
 * @param {object} req
 * @param {object} res
 */
const getAllUsers = async (req, res) => {
  try {
    console.log("All Users");
    //const { status, search, page } = req.query;  - Will be needed when search member dropdown will be added
    const { page } = req.query;

    const group_id = await userService.getGroupId(req.user.id);

    const count = await userService.getAllUsersOfGroupCount(group_id);
    
    let offset = 0;
    if (count > USERS_PER_PAGE) {
      offset = page * USERS_PER_PAGE;
    }

    const userIds = await userService.getAllUsersOfGroup(
      group_id,
      USERS_PER_PAGE,
      offset
    );

    const users = [];

    for (let i = 0; i < userIds.length; i++) {
      const userData = await userService.getUserData(userIds[i]);
      const user = _.pick(userData, ["id", "name", "email", "role_id"]);
      user.status = userData.is_verified;
      users.push(user);
    }

    return res.status(200).json({
      status: true,
      message: "All Users",
      data: {
        numberOfUsers: count ?? 0,
        users: users ?? [],
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Get All User roles
 * @function
 * @name getRoles
 * @param {object} req
 * @param {object} res
 */
const getRoles = async (req, res) => {
  try {
    console.log("All Roles");

    const roles = await userService.getRoles();

    return res.status(200).json({
      status: true,
      message: "All Roles",
      data: {
        roles: roles ?? [],
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Get data of a specific user with id
 * @function
 * @name getUserData
 * @param {object} req
 * @param {object} res
 */
const getUserData = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserData(id);
    user.role = await userService.getUserRole(user.role_id);

    let imageUrl = "";
    if (user.profile_pic) {
      imageUrl = await getFileUrl(user.profile_pic);
    }

    return res.status(200).json({
      status: true,
      message: "User Data",
      data: {
        user: {
          id: user.id,
          name: user.name ?? "",
          role: user.role ?? "",
          email: user.email,
          category_id: user.category_id ? `${user.category_id}` : "",
          subcategory_id: user.subcategory_id ? `${user.subcategory_id}` : "",
          imageUrl: imageUrl,
          company_name: user.company_name,
        },
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Update User Information
 * @function
 * @name updateUser
 * @param {object} req
 * @param {object} res
 */
const updateUserData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Profile update failed" });
  }

  try {
    const updates = _.pick(req.body, [
      "name",
      "company_name",
      "category_id",
      "subcategory_id",
      "address"
    ]);
    updates["category_id"] = parseInt(updates["category_id"]);
    updates["subcategory_id"] = parseInt(updates["subcategory_id"]);

    if (req?.file || !req.body.profile_pic) {
      const oldUserData = await userService.getUserData(req.user.id);
      const oldImagePath = oldUserData?.profile_pic;
      if (oldImagePath) {
        // Delete Image from S3 Bucket
        await deleteFilefromS3(oldImagePath);
      }
    }

    if (!req.body.profile_pic) {
      if (req?.file) {
        const file = req.file;
        updates.profile_pic = await saveFileInS3(file, "profilePics/");
      } else {
        updates.profile_pic = null;
      }
    }

    if (req.user.role === "admin") {
      const group_id = await userService.getGroupId(req.user.id); // Only for admin
      await userService.updateGroup(group_id, updates.company_name); // Only for admin
    }

    const user = await userService.updateUserData(req.user.id, updates);
    user.role = await userService.getUserRole(user.role_id);

    let imageUrl = "";
    if (user.profile_pic) {
      imageUrl = await getFileUrl(user.profile_pic);
    }

    return res.status(200).json({
      status: true,
      message: "Profile information updated successfully",
      data: {
        user: {
          id: user.id,
          name: user.name ?? "",
          role: user.role ?? "",
          email: user.email,
          category_id: user.category_id ? `${user.category_id}` : "",
          subcategory_id: user.subcategory_id ? `${user.subcategory_id}` : "",
          imageUrl: imageUrl,
          company_name: user.company_name,
          address: user.address ?? "",
        },
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Updates User Password
 * @function
 * @name updatePassword
 * @param {object} req
 * @param {object} res
 */
const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Password update failed" });
  }

  try {
    const user = await userService.getUserData(req.user.id);

    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser)
      return res.json({ status: false, message: "Password Mismatch" });

    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.json({ status: false, message: "Password Mismatch" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword, salt);

    const updatedUser = await userService.updateUserData(req.user.id, {
      password: newPassword,
    });

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: true,
      message: "Password update failed",
    });
  }
};

/**
 * Updates User's Role
 * @function
 * @name updateUserRole
 * @param {object} req
 * @param {object} res
 */
const updateUserRole = async (req, res) => {
  try {
    console.log("Update User Role");
    const id = req.params.id;
    const update = _.pick(req.body, ["role_id"]);

    const updatedUser = await userService.updateUserData(id, update);
    const user = _.pick(updatedUser, ["id", "role_id"]);
    //user.status = updatedUser.is_verified;

    return res.status(200).json({
      status: true,
      message: "User's role updated successfully",
      data: {
        user: user ?? {},
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: true,
      message: "Upadting user's role was unsuccessful",
    });
  }
};

/**
 * Delete User
 * @function
 * @name deleteUser
 * @param {object} req
 * @param {object} res
 */
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Delete User with ID: ${id}`);

    await userService.deleteUserGroup(id);
    const deletedId = await userService.deleteUser(id);

    const group_id = await userService.getGroupId(req.user.id);
    const count = await userService.getAllUsersOfGroupCount(group_id);

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: {
        user: {
          numberOfUsers: count ?? 0,
          id: deletedId,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "User deletion unsuccessful",
    });
  }
};

/**
 * Invite New User
 * @function
 * @name inviteUser
 * @param {object} req
 * @param {object} res
 */
const inviteUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "User invitation unsuccessful",
      error: errors.array(),
    });
  }

  try {
    let user = await authService.authenticateUser(req.body.email);
    if (user && !user?.is_deleted) {
      return res.json({ status: false, message: "Email already exists" });
    }

    console.log("Invite User");

    let newUser;
    if (user?.is_deleted) {
      const updates = _.pick(req.body, ["name", "role_id"]);
      newUser = await userService.reAddUser(user?.id, updates);
      await userService.reAddUserGroup(user?.id);
    } else {
      user = _.pick(req.body, ["name", "email", "role_id"]);
      user.company_name = req.user.company_name;

      newUser = await authService.createUser(user); // Create New User

      const group_id = await userService.getGroupId(req.user.id); // Get Group Id
      await authService.addUserGroup(newUser?.id, group_id); // Add User to the group
    }

    newUser.role = await authService.getUserRole(newUser.role_id);

    const payload = {
      sub: newUser?.id,
      name: newUser?.company_name,
      role: newUser?.role,
      iat: Date.now(),
    };

    const emailToken = tokenGenerator.generateInviteUserToken(payload);
    const url = `${process.env.SERVER_URL}/api/v1/auth/invitation/${emailToken}`;

    const info = await emailSender(
      user.email,
      "Campaign Builder - User Invitation",
      `You have been invited by ${newUser.company_name} to join their team. Please click this link to accept their invitation and set your password: <a href="${url}">${url}</a>`
    );

    const userData = _.pick(newUser, ["id", "name", "email", "role_id"]);
    userData.status = newUser.is_verified;

    const group_id = await userService.getGroupId(req.user.id);
    const count = await userService.getAllUsersOfGroupCount(group_id);

    return res.status(200).json({
      status: true,
      message: "New user invited successfully",
      data: {
        numberOfUsers: count ?? 0,
        user: userData ?? {},
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "User invitation unsuccessful",
    });
  }
};

/**
 * Resend invite to New User
 * @function
 * @name resendInvite
 * @param {object} req
 * @param {object} res
 */
const resendInvite = async (req, res) => {
  try {
    let user = await userService.getUserData(req.body.id);
    if (!user) {
      return res.json({ status: false, message: "User does not exist" });
    }

    console.log("Resend Invite");

    user.role = await authService.getUserRole(user.role_id);
    const payload = {
      sub: user.id,
      name: user.company_name,
      role: user.role,
      iat: Date.now(),
    };

    const emailToken = tokenGenerator.generateInviteUserToken(payload);
    const url = `${process.env.SERVER_URL}/api/v1/auth/invitation/${emailToken}`;

    const info = await emailSender(
      user.email,
      "Campaign Builder - User Invitation",
      `You have been invited by ${user.company_name} to join their team. Please click this link to accept their invitation and set your password: <a href="${url}">${url}</a>`
    );

    return res.status(200).json({
      status: true,
      message: "Resend invitation successfully",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Resend invitation unsuccessful",
    });
  }
};

module.exports = {
  getAllUsers,
  getRoles,
  getUserData,
  updateUserData,
  updatePassword,
  updateUserRole,
  deleteUser,
  inviteUser,
  resendInvite,
};
