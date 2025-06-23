import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SingleProductDetailed from "./components/singleProduct";
import Products from "./components/products";
import NavigationBar from "./components/navigationBar";

import Login from "./components/loginPage";

import { AuthHook } from "./hooks";

const Home = () => (
  <div>
    <h2>this is home page</h2>
  </div>
);

const App = () => {
  const { user, isLoading, error } = AuthHook();

  if (isLoading) {
    return <div>loading ...</div>;
  }

  if (error) {
    return <div>error with system, try agian later.</div>;
  }

  return (
    <Container>
      <Router>
        {!isLoading && user ? (
          <div>hello {user.user.username}!</div>
        ) : (
          <div>not logged in</div>
        )}
        <NavigationBar />
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProductDetailed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          /> */}
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
