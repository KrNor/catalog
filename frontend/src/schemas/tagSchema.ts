import { z } from "zod";

export const tagInsideProductSchema = z.object({
  tagName: z.string().min(3).max(125),
  tagAttribute: z.string().min(3).max(125),
});

export const tagSchema = z.object({
  tagName: z.string().min(3).max(125),
  tagAttributes: z.array(z.string().min(3).max(125)),
});

export const tagWithIdSchema = z.object({
  ...tagSchema.shape,
  id: z.string(),
});

export const tagInsideProductWithIdSchema = z.object({
  ...tagInsideProductSchema.shape,
  id: z.string(),
});

export const tagInSearchSchema = z.object({
  tags: z.record(z.string(), z.array(z.string())),
});

export type TagInSearchSchemaType = z.infer<typeof tagInSearchSchema>;
export type TagSchemaType = z.infer<typeof tagSchema>;
export type TagWithIdSchemaType = z.infer<typeof tagWithIdSchema>;

export type TagInsideProductSchemaType = z.infer<typeof tagInsideProductSchema>;
export type TagInsideProductWithIdSchemaType = z.infer<
  typeof tagInsideProductWithIdSchema
>;
