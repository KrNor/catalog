import { Container, Spinner, Alert } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SingleProductDetailed from "./components/singleProduct";
import Products from "./components/products";
import NavigationBar from "./components/navigationBar";
import AdminPanel from "./components/adminComp/adminPanel";
import CreateCategory from "./components/adminComp/createCategory";
import ManageCategories from "./components/adminComp/manageCategories";
import CreateProduct from "./components/adminComp/createProduct";
import ManageProducts from "./components/adminComp/manageProducts";
import ProtectedRoute from "./components/protectedRoute";
import PanelHome from "./components/adminComp/panelHome";
import Login from "./components/loginPage";
import SingleProductEdit from "./components/adminComp/singleProductEdit";
import UploadImage from "./components/adminComp/uploadImage";

import { AuthHook } from "./hooks";

const Home = () => (
  <div>
    <h2>Welcome to the Catalog!</h2>
  </div>
);

const App = () => {
  const { isLoading, error } = AuthHook(); //user?

  if (isLoading) return <Spinner animation="border" />;

  if (error)
    return <Alert variant="danger">error with system, try agian later.</Alert>;

  return (
    <Container>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<SingleProductDetailed />} />
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="panel" element={<AdminPanel />}>
              <Route index element={<PanelHome />} />
              <Route path="createCategory" element={<CreateCategory />} />
              <Route path="manageCategories" element={<ManageCategories />} />
              <Route path="createProduct" element={<CreateProduct />} />
              <Route path="manageProducts" element={<ManageProducts />} />
              <Route
                path="manageProducts/:id"
                element={<SingleProductEdit />}
              />
              <Route path="uploadImage" element={<UploadImage />} />
            </Route>
          </Route>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <Container>
        <footer className="py-5">
          <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
            <p>&copy; 2025 Catalog, Inc. All rights reserved.</p>
            <ul className="list-unstyled d-flex"></ul>
          </div>
        </footer>
      </Container>
    </Container>
  );
};

export default App;
