const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || process.env.AWS_REGION || "ap-south-1",
});

const uploadToS3 = async (filePath, file) => {
  try {
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME is missing in .env");
    }

    const fileBuffer = fs.readFileSync(filePath);

    const s3Key = `event-media/${Date.now()}-${file.filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    const s3Region =
      process.env.AWS_S3_REGION || process.env.AWS_REGION || "ap-south-1";

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${s3Region}.amazonaws.com/${s3Key}`;

    return {
      fileUrl,
      s3Key,
    };
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw error;
  }
};

module.exports = uploadToS3;