import cloudinary from "../lib/cloudinary.js";

const extractPublicId = (url) => {
    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0];
    const folder = parts.pop();
    return `${folder}/${fileName}`;
}

export const uploadImage = async (file) => {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: "ai-lms/thumbnails"
    });
    return uploadResponse;
}

export const deleteImage = async (imageUrl) => {
    await cloudinary.uploader.destroy(imageUrl)

}