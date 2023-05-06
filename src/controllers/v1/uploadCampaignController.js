const path = require("path");
const uploadService = require("../../services/v1/uploadCampaignService");
const { saveFileInS3, deleteFilefromS3 } = require("../../database/aws_s3");

/**
 * Creates a new Upload
 * @function
 * @name createUpload
 * @param {object} req
 * @param {object} res
 */
const createUpload = async (req, res) => {
  try {
    const upload = {};
    if (req?.files) {
      const file = req.files[0];
      const fileExt = path.extname(file.originalname);
      upload.size = file.size;
      upload.mimetype = file.mimetype;
      upload.extension = fileExt;
      upload.file = await saveFileInS3(file, "campaigns/");
    } else {
      return res.json({
        status: false,
        message: "No file uploaded",
      });
    }

    const uploaded = await uploadService.createUpload(upload);

    return res.status(201).json({
      status: true,
      message: "Upload Successful",
      data: {
        id: uploaded.id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Deletes a upload
 * @function
 * @name deleteUpload
 * @param {object} req
 * @param {object} res
 */
const deleteUpload = async (req, res) => {
  try {
    const upload = await uploadService.getUpload(req.params.id);
    if (!upload) {
      return res.json({
        status: false,
        message: "No file found",
      });
    }

    await deleteFilefromS3(upload.file);

    const deleted = await uploadService.deleteUpload(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Deleted Successfully",
      data: {
        id: deleted.id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  createUpload,
  deleteUpload,
};
