import { v2 as cloudinary } from "cloudinary";

import { CloudinaryOptionsType } from "../types";

export interface CloudinaryConfig {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface CloudinaryUploadInfo {
  apiKey: string;
  cloudName: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getImageUploadInfo = (): CloudinaryUploadInfo => {
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME)
    return {
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    };
  else {
    throw new Error("Image service variables are not set.");
  }
};

export const getSignedUrlForUpload = async (
  cObject: CloudinaryOptionsType
): Promise<CloudinaryConfig> => {
  const paramsToSign = {
    timestamp: cObject.timestamp,
    folder: "products", // tobe changed
    source: cObject.source,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME)
    return {
      timestamp: cObject.timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: "products",
    };
  else {
    throw new Error("Image service variables are not set.");
  }
};
