const db = require("../../database/db");

/**
 * Saves new upload to the database
 * @function
 * @name createUpload
 * @param {object} upload - Contains file, size, mimetype and extension of the upload
 */
const createUpload = async (upload) => {
  const newUpload = await db("campaign_files").insert(
    {
      file: upload.file,
      size: upload.size,
      mimetype: upload.mimetype,
      extension: upload.extension,
    },
    ["*"]
  );

  return newUpload[0];
};

/**
 * Get a upload with id
 * @function
 * @name getUpload
 * @param {string} id - Upload's id
 */
const getUpload = async (id) => {
  const upload = await db("campaign_files").select("*").from("campaign_files").where({
    id: id,
  });
  return upload[0];
};

/**
 * Deltes upload to the database
 * @function
 * @name deleteUpload
 * @param {object} id - id of the upload to be deleted
 */
const deleteUpload = async (id) => {
  const upload = await db("campaign_files").del(["*"]).where({
    id: id,
  });

  return upload[0];
};

module.exports = {
  createUpload,
  getUpload,
  deleteUpload,
};
