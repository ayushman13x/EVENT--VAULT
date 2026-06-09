const path = require("path");
const sharp = require("sharp");

const compressImage = async (filePath, file) => {
  const isImage = file.mimetype.startsWith("image/");

  if (!isImage) {
    return filePath;
  }

  const parsedPath = path.parse(filePath);

  const compressedPath = path.join(
    parsedPath.dir,
    `compressed-${parsedPath.name}.jpg`
  );

  await sharp(filePath)
    .rotate()
    .resize({
      width: 1600,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
      mozjpeg: true,
    })
    .toFile(compressedPath);

  return compressedPath;
};

module.exports = compressImage;