import cloudinary from "../lib/cloudinary.js";

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop().split(".")[0];
  const folder = parts.pop();
  return `${folder}/${fileName}`;
}

export const uploadImage = async (file) => {
    const uploadResponse = await cloudinary.uploader.upload(file.path);
    return uploadResponse.secure_url;
}

export const deleteImage = async (imageUrl) => {
    const publicId = extractPublicId(imageUrl);
    await cloudinary.uploader.destroy(publicId);

}