export interface UserObject {
  user: {
    username: string;
    id: string;
    role: "admin" | "user" | "";
  };
}
export interface LoginDetails {
  username: string;
  password: string;
}
