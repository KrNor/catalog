export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const COOKIE_NAME = "authToken";

export const cookieOptions = {
  httpOnly: true, // makes cookie not avliable to client (from what I understand)
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // same as 7d
  path: "/",
};
