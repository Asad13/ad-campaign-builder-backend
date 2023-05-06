const db = require("../../database/db");

/**
 * Fetch user's data from database(postgres) based on id
 * @function
 * @name getUserData
 * @param {string} id - User ID
 */
const getUserData = async (id) => {
  const user = await db("users").select("*").from("users").where({
    id: id,
  });
  return user[0];
};

/**
 * Get a user is verified or not from database(postgres) based on id
 * @function
 * @name getUserIsVerified
 * @param {string} id - User ID
 */
const getUserIsVerified = async (id) => {
  const verifieds = await db("users").select("is_verified").from("users").where({
    id: id,
  });
  return verifieds[0].is_verified;
};

/**
 * Fetch user's role from users table in database(postgres) based on id
 * @function
 * @name getUserRoleFromUserTable
 * @param {string} id - User ID
 */
const getUserRoleFromUserTable = async (id) => {
  const userRoles = await db("users").select("role_id").from("users").where({
    id: id,
  });
  return userRoles[0].role_id;
};

/**
 * Fetch user's role from database(postgres) based on role_id
 * @function
 * @name getUserRole
 * @param {string} role_id
 */
const getUserRole = async (role_id) => {
  const roles = await db("roles").select("name").from("roles").where({
    id: role_id,
  });
  return roles[0].name;
};

/**
 * Fetch user's role id from database(postgres) based on role name
 * @function
 * @name getUserRoleId
 * @param {string} name
 */
const getUserRoleId = async (name) => {
  const role = await db("roles").select("id").from("roles").where({
    name: name,
  });
  return role[0].id;
};

/**
 * Update user's Password
 * @function
 * @name updateUserData
 * @param {string} id - User's ID
 * @param {object} updates - User's ID
 */
const updateUserData = async (id, updates) => {
  const updatedUser = await db("users")
    .where({
      id: id,
    })
    .update(
      {
        ...updates,
      },
      ["*"]
    );
  return updatedUser[0];
};

/**
 * Get Group Id of a user
 * @function
 * @name getGroupId
 * @param {string} user_id
 */
const getGroupId = async (user_id) => {
  const groudIds = await db("users_groups")
    .select("group_id")
    .from("users_groups")
    .where({
      user_id: user_id,
    });
  return groudIds[0].group_id;
};

/**
 * Get Number of Users of a group
 * @function
 * @name getAllUsersOfGroupCount
 * @param {string} group_id
 */
const getAllUsersOfGroupCount = async (group_id) => {
  const userIds = await db("users_groups")
    .select("user_id")
    .from("users_groups")
    .where({
      group_id: group_id,
      is_deleted: false,
    });
  return userIds.length;
};

/**
 * Get All Users of a group
 * @function
 * @name getAllUsersOfGroup
 * @param {string} group_id
 */
const getAllUsersOfGroup = async (group_id, limit, offset) => {
  let userIds = [];
  if (limit && offset) {
    userIds = await db("users_groups")
      .select("user_id")
      .from("users_groups")
      .limit(limit)
      .offset(offset)
      .where({
        group_id: group_id,
        is_deleted: false,
      });
  } else if(limit) {
    userIds = await db("users_groups")
      .select("user_id")
      .from("users_groups")
      .limit(limit)
      .where({
        group_id: group_id,
        is_deleted: false,
      });
  }else{
    userIds = await db("users_groups")
      .select("user_id")
      .from("users_groups")
      .where({
        group_id: group_id,
        is_deleted: false,
      });
  }

  return userIds.map((userId) => userId.user_id);
};

/**
 * Update Group's Name(Company Name)
 * @function
 * @name updateGroup
 * @param {string} id - Group's ID
 * @param {string} name - Company Name
 */
const updateGroup = async (id, name) => {
  const updatedGroup = await db("groups")
    .where({
      id: id,
    })
    .update(
      {
        name: name,
      },
      ["*"]
    );
  return updatedGroup[0];
};

/**
 * Delete USER from Group - SET is_deleted = true
 * @function
 * @name deleteUserGroup
 * @param {string} id - User ID
 */
const deleteUserGroup = async (id) => {
  await db("users_groups")
    .where({
      user_id: id,
    })
    .update({
      is_deleted: true,
    });
};

/**
 * Delete USER - SET is_deleted = true
 * @function
 * @name deleteUser
 * @param {string} id - User ID
 */
const deleteUser = async (id) => {
  const deletedIds = await db("users")
    .where({
      id: id,
    })
    .update(
      {
        is_deleted: true,
      },
      ["id"]
    );
  return deletedIds[0].id;
};

/**
 * Readd USER to Group - SET is_deleted = false
 * @function
 * @name reAddUserGroup
 * @param {string} id - User ID
 */
const reAddUserGroup = async (id) => {
  await db("users_groups")
    .where({
      user_id: id,
    })
    .update({
      is_deleted: false,
    });
};

/**
 * Readd USER - SET is_deleted = false
 * @function
 * @name reAddUser
 * @param {string} id - User ID
 */
const reAddUser = async (id, updates) => {
  const reAddedUsers = await db("users")
    .where({
      id: id,
    })
    .update(
      {
        is_deleted: false,
        ...updates
      },
      ["*"]
    );
  return reAddedUsers[0];
};

/**
 * Fetch All User Roles from Database
 * @function
 * @name getRoles
 */
const getRoles = async () => {
  const roles = await db("roles").select("*").from("roles");

  return roles;
};

module.exports = {
  getUserData,
  getUserIsVerified,
  updateUserData,
  getUserRoleFromUserTable,
  getUserRole,
  getUserRoleId,
  getGroupId,
  getAllUsersOfGroupCount,
  getAllUsersOfGroup,
  updateGroup,
  deleteUserGroup,
  deleteUser,
  getRoles,
  reAddUserGroup,
  reAddUser
};
