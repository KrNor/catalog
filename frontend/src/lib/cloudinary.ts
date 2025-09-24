import { Cloudinary } from "@cloudinary/url-gen";
import { axiosGet } from "./axios";

import type {
  ImageUploadInfo,
  ImageUploadSignatureObject,
} from "../types/types";
import { imageSignatureSchema } from "../schemas/imageSignatureSchema";

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

export const getSignatureForImage = async (params: string) => {
  const axiGetResponse = await axiosGet(params);
  // console.log(axiGetResponse);
  const resultOfParse = imageSignatureSchema.safeParse(axiGetResponse);
  // console.log(resultOfParse);

  if (resultOfParse.success) {
    return resultOfParse.data as ImageUploadSignatureObject;
  } else {
    console.log("something is wrong with the data gotten back form the server");
    return {} as ImageUploadSignatureObject;
  }
};
