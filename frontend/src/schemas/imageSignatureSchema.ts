import { z } from "zod";

export const imageSignatureSchema = z.object({
  timestamp: z.number(),
  signature: z.string(),
  apiKey: z.string(),
  cloudName: z.string(),
  folder: z.string(),
});

export type ImageSignatureSchemaType = z.infer<typeof imageSignatureSchema>;
