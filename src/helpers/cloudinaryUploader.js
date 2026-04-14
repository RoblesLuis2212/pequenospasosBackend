import cloudinary from "./cloudinary.js";

const subirImagenCloudinary = (buffer) => {
  return new Promise((resolv, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "PequenosPasos" },
      (error, result) => {
        if (result) {
          resolv(result);
        } else {
          reject(error);
        }
      },
    );
    stream.end(buffer);
  });
};

export default subirImagenCloudinary;
