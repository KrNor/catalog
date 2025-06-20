import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SingleProductDetailed from "./components/singleProduct";
import Products from "./components/products";
import NavigationBar from "./components/navigationBar";
import Login from "./components/loginPage";

import AdminPanel from "./components/adminPanel";

// temp teesting
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, emptyUser } from "./reducers/userReducer";
import Cookies from "js-cookie";
import UserService from "./services/users";

const axiosInstance = axios.create({
  withCredentials: true,
});

const Home = () => (
  <div>
    <h2>this is home page</h2>
  </div>
);
// import type { UserObject } from "./types";
// import type { UnknownAction } from "@reduxjs/toolkit";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const resultOfProtectionCheck = UserService.checkUserRole().then(
    (resultat) => {
      if (!(resultat === "admin")) {
        return children;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  );

  return resultOfProtectionCheck;
};

const App = () => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      if (Cookies.get("isLoggedIn") === "true") {
        console.log("user is logged in");
        axiosInstance
          .get("http://localhost:3000/api/auth/check")
          // .then((response) => {
          //   console.log(response.data.user.id);
          // })
          .then((response) => {
            dispatch(
              setUser({
                id: response.data.user.id,
                username: response.data.user.username,
                role: response.data.user.role,
              })
            );
          })
          .catch(() => dispatch(emptyUser()));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Container>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProductDetailed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/panel" element={} /> */}
        </Routes>
        <div>
          <p>this is app</p>
        </div>
      </Router>
    </Container>
  );
};

export default App;
