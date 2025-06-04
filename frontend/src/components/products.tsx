import { initializeProducts } from "../reducers/productReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../types";

import { Container, Row, Card, Col } from "react-bootstrap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleProduct = (props: any) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/products/${props.product.id}`)}
      style={{ width: "32rem", cursor: "pointer" }}
    >
      <Card.Img variant="top" src="src/images/holderSmall.jpg" />
      <Card.Body>
        <Card.Title>{props.product.name}</Card.Title>
        <Card.Text>{props.product.descriptionShort}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Products = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(initializeProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = useSelector((state: RootState) => {
    return state.products;
  });

  return (
    <Container>
      <Row>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={12} // 1 product per row on extra small screens
            sm={6} // 2 products per row on small screens
            md={4} // 3 products per row on medium screens
            lg={3} // 4 products per row on large screens
            xl={2} // 6 products per row on extra large screens
            className="mb-4 d-flex"
          >
            <SingleProduct key={product.id} product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;
