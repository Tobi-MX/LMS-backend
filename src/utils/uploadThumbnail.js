import cloudinary from "../lib/cloudinary.js";

export const uploadThumbnail = async (file) => {
    const uploadResponse = await cloudinary.uploader.upload(file.path);
    return uploadResponse.secure_url;
};