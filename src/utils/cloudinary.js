import cloudinary from "../lib/cloudinary.js";

export const uploadImage = async (file) => {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: "ai-lms/thumbnails",
        access_mode: "public"
    });
    return uploadResponse;
}

export const deleteImage = async (imageUrl) => {
    await cloudinary.uploader.destroy(imageUrl)
}

export const uploadLesson = async (file) => {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        access_mode: "public",
        folder: "ai-lms/lessons"
    });
    return uploadResponse;
}

export const deleteLesson = async (lessonUrl) => {
    await cloudinary.uploader.destroy(lessonUrl)
}
