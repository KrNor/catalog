import { Container, Row, Card, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "../reducers/apiReducer";
import type { SimplifiedProduct } from "../types";

import SearchFilters from "./searchFilters";

interface SingleProductProps {
  product: SimplifiedProduct;
}

const SingleProduct = ({ product }: SingleProductProps) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/products/${product.id}`)}
      style={{ width: "32rem", cursor: "pointer" }}
    >
      <Card.Img variant="top" src="src/images/holderSmall.jpg" />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.descriptionShort}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const { data, error, isLoading } = useGetProductsQuery(queryString);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        error occured when getting products, try again later.
      </Alert>
    );
  }

  if (data) {
    return (
      <Container>
        <Row>
          <Col sm={2}>
            <SearchFilters />
          </Col>
          <Col sm={10}>
            <Container>
              <Row>
                {data.map((product) => (
                  <Col
                    key={product.id}
                    xs={12} // 1 product per row on extra small screens
                    sm={6} // 2 products per row on small screens
                    md={4} // 3 products per row on medium screens
                    lg={3} // 4 products per row on large screens
                    xl={2} // 6 products per row on extra large screens
                    className="mb-4 d-flex"
                  >
                    <SingleProduct product={product} />
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Products;
