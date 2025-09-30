import apiService from "@/services/apiService";
import { imageSignatureSchema } from "@/schemas/imageSignatureSchema";
import type { ImageUploadSignatureObject } from "@/types/image";

export const imageService = {
  getSignatureForImage: async (params: string) => {
    const axiGetResponse = await apiService.get(`image/signature?${params}`);
    const resultOfParse = imageSignatureSchema.safeParse(axiGetResponse);

    if (resultOfParse.success) {
      return resultOfParse.data as ImageUploadSignatureObject;
    } else {
      console.log(
        "something is wrong with the data gotten back form the server"
      );
      return {} as ImageUploadSignatureObject;
    }
  },
};
export default imageService;
