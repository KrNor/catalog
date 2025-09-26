import { Container, Spinner, Alert } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SingleProductDetailed from "./pages/SingleProduct/singleProduct";
import Products from "./pages/Products/products";
import NavigationBar from "./components/ui/navigationBar";
import Footer from "./components/ui/footer";
import AdminPanel from "./pages/AdminPanel/adminPanel";
import CreateCategory from "./pages/AdminPanel/Selection/createCategory";
import ManageCategories from "./pages/AdminPanel/Selection/manageCategories";
import CreateProduct from "./pages/AdminPanel/Selection/createProduct";
import ManageProducts from "./pages/AdminPanel/Selection/manageProducts";
import ProtectedRoute from "./components/auth/protectedRoute";
import PanelHome from "./pages/AdminPanel/Selection/panelHome";
import Login from "./pages/Login/loginPage";
import SingleProductEdit from "./pages/AdminPanel/Selection/singleProductEdit";
import UploadImage from "./pages/AdminPanel/uploadImage";
import Home from "./pages/Home/Home";

import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { isLoading, error } = useAuth();

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
      <Footer />
    </Container>
  );
};

export default App;
