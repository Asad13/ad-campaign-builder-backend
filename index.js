require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require('path');
const app = express();
const v1AuthRouter = require("./src/routes/v1/auth");
const v1UserRouter = require("./src/routes/v1/user");
const v1CampaignRouter = require("./src/routes/v1/campaign");
const v1FinanceRouter = require("./src/routes/v1/finance");
const v1UploadCampaignRouter = require("./src/routes/v1/uploadCampaign");
const corsOptions = require("./src/config/corsOptions");
const credentials = require("./src/middlewares/v1/credentials");
const multerUploadImage = require("./src/middlewares/v1/multerUploadImage");
const multerUploadVideo = require("./src/middlewares/v1/multerUploadVideo");
const redis_client = require("./src/database/redis_connect");

if (process.env.NODE_ENV === "production") {
  app.use(compression());
}
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(express.static('uploads'));//path.join(__dirname, 'uploads')

redis_client.connect();

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v1/users", multerUploadImage.single('profile_pic'), v1UserRouter);
app.use("/api/v1/campaigns", v1CampaignRouter);
app.use("/api/v1/uploads/campaigns/images",multerUploadImage.array('uploads'), v1UploadCampaignRouter);
app.use("/api/v1/uploads/campaigns/videos",multerUploadVideo.array('uploads'), v1UploadCampaignRouter);
app.use("/api/v1/uploads/campaigns", v1UploadCampaignRouter);
app.use("/api/v1/finance", v1FinanceRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err) {
    return res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}...`);
});
