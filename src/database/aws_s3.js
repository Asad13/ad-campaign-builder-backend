const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const path = require("path");
const { generateRandomBytes } = require("../utils/utilityFunctions");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const expiresIn = process.env.AWS_SIGNED_URL_EXPRIRATION_TIME;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const saveFileInS3 = async (file, folder = "") => {
  let fileBuffer = file.buffer;
  if (file.mimetype.includes("image")) {
    if (folder.includes("profilePics")) {
      fileBuffer = await sharp(file.buffer)
        .resize({ height: 100, width: 100, fit: "cover" })
        .toBuffer();
    }
  }

  // Configure the upload details to send to S3
  const fileExt = path.extname(file.originalname);
  const fileName =
    folder +
    file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
    "-" +
    generateRandomBytes();
    
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  console.log(`Uploaded ${fileName} file to AWS successfully.`);
  return fileName;
};

const getFileUrl = async (imagePath) => {
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: imagePath,
    }),
    { expiresIn: expiresIn } // 1hr
  );
};

const deleteFilefromS3 = async (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
  console.log(`Deleted ${fileName} file from AWS successfully.`);
};

module.exports = {
  s3Client,
  saveFileInS3,
  getFileUrl,
  deleteFilefromS3,
};
