const fs = require("fs");
const sharp = require("sharp");

const {
  RekognitionClient,
  CompareFacesCommand,
  DetectFacesCommand,
} = require("@aws-sdk/client-rekognition");

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

const prepareImageBuffer = async (imagePath) => {
  return sharp(imagePath)
    .rotate()
    .jpeg({ quality: 90 })
    .toBuffer();
};

const detectFaceCount = async (imageBuffer, label) => {
  try {
    const command = new DetectFacesCommand({
      Image: {
        Bytes: imageBuffer,
      },
      Attributes: ["DEFAULT"],
    });

    const response = await rekognitionClient.send(command);
    const count = response.FaceDetails?.length || 0;



    return count;
  } catch (error) {
    console.error(`${label} face detection failed:`, error.message);
    return 0;
  }
};

const compareFaces = async (sourceImagePath, targetImagePath) => {
  try {
    const sourceBytes = await prepareImageBuffer(sourceImagePath);
    const targetBytes = await prepareImageBuffer(targetImagePath);

    const sourceFaceCount = await detectFaceCount(sourceBytes, "Source");
    const targetFaceCount = await detectFaceCount(targetBytes, "Target");

    if (sourceFaceCount === 0 || targetFaceCount === 0) {
      return false;
    }

    const command = new CompareFacesCommand({
      SourceImage: {
        Bytes: sourceBytes,
      },
      TargetImage: {
        Bytes: targetBytes,
      },
      SimilarityThreshold: 60,
    });

    const response = await rekognitionClient.send(command);

    const matches = response.FaceMatches || [];

    if (matches.length > 0) {

      return true;
    }

    return false;
  } catch (error) {
    console.error("Face comparison failed:", error.message);
    return false;
  }
};

module.exports = compareFaces;