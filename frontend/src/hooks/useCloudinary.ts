import { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

import { useGetImageInfoQuery } from "@/redux/apiReducer";
import { initializeCloudinary } from "@/services/client/cloudinaryClient";

export const useCloudinary = () => {
  const [cloudinaryInstance, setCloudinaryInstance] = useState<
    Cloudinary | undefined
  >(undefined);

  const {
    data: cloudinaryUploadInfo,
    isLoading: cloudinaryInfoLoading,
    error: cloudinaryInfoError,
  } = useGetImageInfoQuery();

  useEffect(() => {
    if (cloudinaryUploadInfo && !cloudinaryInstance) {
      setCloudinaryInstance(initializeCloudinary(cloudinaryUploadInfo));
    }
  }, [cloudinaryUploadInfo, cloudinaryInstance]);

  return {
    cloudinaryInstance,
    cloudinaryUploadInfo,
    cloudinaryInfoLoading,
    cloudinaryInfoError,
    cloudinaryInstanceAndInfoLoaded:
      !!cloudinaryInstance && !!cloudinaryUploadInfo,
  };
};
