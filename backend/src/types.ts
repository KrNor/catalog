import z from "zod";
export interface Product {
  name: String;
  price: Number; // saved in cents
  avaliability: Number;
  Identifier: String;
  descriptionShort: String;
  descriptionLong: String;
  categoryArray: [String];
}

export const zodProduct = z.object({
  name: z.string().min(3),
  price: z.number().nonnegative(),
  avaliability: z.number().gte(-4),
  Identifier: z.string(),
  descriptionShort: z.string().min(3),
  descriptionLong: z.string().min(3),
  categoryArray: z.array(z.string()),
});

export type zodProductType = z.infer<typeof zodProduct>;
