import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { loginUserThunk } from "../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../types";

interface userLoginThing {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => {
    return state.user;
  });

  useEffect(() => {
    if (userData.username.length > 2) {
      console.log("you are already logged in!");
    }
    console.log(console.log("not logged in"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginSubmit = (formData: FormData): void => {
    const usersLogins: userLoginThing = { username: "", password: "" };
    for (const pair of formData.entries()) {
      if (pair[0] == "username" && typeof pair[1] === "string") {
        usersLogins[pair[0]] = pair[1];
      }
      if (pair[0] == "password" && typeof pair[1] === "string") {
        usersLogins[pair[0]] = pair[1];
      }
    }
    console.log(usersLogins);
    if (usersLogins.username.length > 2 && usersLogins.password.length > 2) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dispatched = dispatch<any>(
        loginUserThunk(usersLogins.username, usersLogins.password)
      );
      console.log("this is what I look for :");
      console.log(dispatched);
      console.log(userData.username);

      navigate(`/login`);
    } else {
      console.log("bad login try again");
    }
  };
  console.log(userData);
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
