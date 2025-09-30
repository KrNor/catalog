import { Cloudinary } from "@cloudinary/url-gen";

import type { ImageUploadInfo } from "@/types/image";

export const initializeCloudinary = (config: ImageUploadInfo): Cloudinary => {
  const cloudinaryInstance = new Cloudinary({
    cloud: {
      cloudName: config.cloudName,
    },
    url: {
      secure: true,
    },
  });
  return cloudinaryInstance;
};
