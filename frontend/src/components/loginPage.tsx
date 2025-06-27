import { Form, Button, Alert } from "react-bootstrap";

import { useAppDispatch, AuthHook } from "../hooks";
import { api } from "../reducers/apiReducer";
import type { LoginDetails } from "../types";

const Login = () => {
  const { user, error, login, logout } = AuthHook();

  const dispatch = useAppDispatch();

  const HandleLogout = async () => {
    await logout();
    dispatch(api.util.resetApiState());
    console.log("logout succsessull");
  };

  if (user) {
    return (
      <div>
        you are already logged in, to logout click:
        <Button onClick={HandleLogout}> logout</Button>
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="danger">error related to login, try again later</Alert>
    );
  }

  const loginSubmit = async (formData: FormData) => {
    const usersLogins: LoginDetails = { username: "", password: "" };
    for (const pair of formData.entries()) {
      if (pair[0] == "username" && typeof pair[1] === "string") {
        usersLogins[pair[0]] = pair[1];
      }
      if (pair[0] == "password" && typeof pair[1] === "string") {
        usersLogins[pair[0]] = pair[1];
      }
    }

    if (usersLogins.username.length > 2 && usersLogins.password.length > 2) {
      const loginObj = {
        username: usersLogins.username,
        password: usersLogins.password,
      } as LoginDetails;

      try {
        await login(loginObj);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        console.log("unknown error");
      }
    } else {
      console.log("bad login try again");
    }
  };

  return (
    <Form action={loginSubmit}>
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control placeholder="username" name="username" type="input" />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default Login;
