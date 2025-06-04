// import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import SingleProductDetailed from "./components/singleProduct";
import Products from "./components/products";
// import type { RootState } from "./store";

// import type { Product } from "./types";

const Home = () => (
  <div>
    <h2>this is home page</h2>
  </div>
);

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   dispatch<any>(initializeProducts());
  // });

  const padding = {
    padding: 5,
  };

  return (
    <Container>
      <Router>
        <div>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/products">
            products
          </Link>
        </div>

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

{
  /* <Switch>
  <Route path={`${match.path}/:topicId`}>
    <Topic />
  </Route>
  <Route path={match.path}>
    <h3>Please select a topic.</h3>
  </Route>
</Switch>; */
}

export default App;
