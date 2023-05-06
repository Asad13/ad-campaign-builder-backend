const db = require("../../database/db");

/**
 * Saves new user in database(postgres) upon signup
 * @function
 * @name createUser
 * @param {object} user - Contains company name, email and password of new user
 */
const createUser = async (user) => {
  const newUser = await db("users").insert(
    {
      ...user
    },
    ["*"]
  );

  return newUser[0];
};

/**
 * creates new groups
 * @function
 * @name createGroup
 * @param {string} user - Company name
 */
const createGroup = async (name) => {
  const newGroup = await db("groups").insert(
    {
      name: name,
    },
    ["id"]
  );

  return newGroup[0].id;
};

/**
 * Add User to Group
 * @function
 * @name addUserGroup
 * @param {string} user_id - User's ID
 * @param {string} group_id - Groups's ID
 */
const addUserGroup = async (user_id, group_id) => {
  const newUserGroup = await db("users_groups").insert(
    {
      user_id: user_id,
      group_id: group_id,
    },
    ["*"]
  );

  return newUserGroup[0];
};

/**
 * Fetch user's data from database(postgres) based on email to verify login
 * @function
 * @name authenticateUser
 * @param {string} email
 */
const authenticateUser = async (email) => {
  const user = await db("users")
    .select("*")
    .from("users")
    .where("email", email);
  return user[0];
};

/**
 * Update user as verified(verfied = true) in database upon successful Email Verification
 * @function
 * @name verifyUser
 * @param {string} id - User's ID
 */
const verifyUser = async (id) => {
  const verfiedUser = await db("users")
    .where({
      id: id,
    })
    .update(
      {
        is_verified: true,
      },
      ["*"]
    );
  return verfiedUser[0];
};

/**
 * Get a User with id
 * @function
 * @name getUser
 * @param {string} id - User's ID
 */
const getUser = async (id) => {
  const user = await db("users").select("*").from("users").where({
    id: id,
  });
  return user[0];
};

/**
 * Resets user's Password
 * @function
 * @name updatePassword
 * @param {string} id - User's ID
 * @param {object} updates - User's ID
 */
const updatePassword = async (id, updates) => {
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
 * Fetch user's role from database(postgres) based on role_id
 * @function
 * @name getUserRole
 * @param {string} role_id
 */
const getUserRole = async (role_id) => {
  const role = await db("roles").select("*").from("roles").where({
    id: role_id,
  });
  return role[0].name;
};

module.exports = {
  createUser,
  authenticateUser,
  verifyUser,
  getUser,
  updatePassword,
  createGroup,
  addUserGroup,
  getUserRole
};
