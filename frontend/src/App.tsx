import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SingleProductDetailed from "./components/singleProduct";
import Products from "./components/products";
import NavigationBar from "./components/navigationBar";

const Home = () => (
  <div>
    <h2>this is home page</h2>
  </div>
);

const App = () => {
  return (
    <Container>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProductDetailed />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <div>
          <p>this is app</p>
        </div>
      </Router>
    </Container>
  );
};

export default App;
