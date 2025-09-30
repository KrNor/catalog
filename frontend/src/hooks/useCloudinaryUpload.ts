import qs from "qs";
import { useRef, useEffect } from "react";
import { useCloudinary } from "@/hooks/useCloudinary";
import imageService from "@/services/imageService";

export const useCloudinaryUpload = () => {
  const widgetRef = useRef<CloudinaryUploadWidget | null>(null);

  const { cloudinaryUploadInfo } = useCloudinary();

  useEffect(() => {
    if (window.cloudinary && cloudinaryUploadInfo) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudinaryUploadInfo.cloudName,
          prepareUploadParams: async (cb, params) => {
            const initSignatureInfo = qs.stringify(params);
            const imageUploadInfo = await imageService.getSignatureForImage(
              initSignatureInfo
            );
            cb({
              apiKey: imageUploadInfo.apiKey,
              folder: imageUploadInfo.folder,
              signature: imageUploadInfo.signature,
              uploadSignatureTimestamp: imageUploadInfo.timestamp,
            });
          },
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Uploaded image:", result.info.secure_url);
          }
        }
      );
    }
  }, [cloudinaryUploadInfo]);

  return {
    widgetRef,
  };
};
