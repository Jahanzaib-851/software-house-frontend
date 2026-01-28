"use client";
import uploadService from "@/services/upload.service";

export default function useUpload() {
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadService.upload(formData);
    return res.data;
  };

  return { uploadFile };
}
