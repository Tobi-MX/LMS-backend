import cloudinary from "../lib/cloudinary.js";

export const uploadImage = async (file) => {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: "ai-lms/thumbnails"
    });
    return uploadResponse;
}

export const deleteImage = async (imageUrl) => {
    await cloudinary.uploader.destroy(imageUrl)

}