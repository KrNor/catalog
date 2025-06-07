import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Card, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  initializeProducts,
  setFilteredProducts,
} from "../reducers/productReducer";

import _ from "lodash";

import type { RootState, QueryObject } from "../types";

import SearchFilters from "./searchFilters";

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

const ProductsFirstLoad = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(initializeProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductsNotFirstLoad = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(setFilteredProducts(props.currQuer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = useSelector((state: RootState) => {
    return state.products;
  });
  // console.log(products);
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

const Products = () => {
  const [searchParams] = useSearchParams();

  const allowedKeys: (keyof QueryObject)[] = [
    "min_price",
    "max_price",
    "search",
    "avaliability",
    "category",
  ];

  const queryThing = allowedKeys.reduce((acc, key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as QueryObject);

  // console.log("this query thing: " + JSON.stringify(queryThing));

  return (
    <Container>
      <Row>
        <Col sm={2}>
          <SearchFilters />
        </Col>
        <Col sm={10}>
          {_.isEmpty(queryThing) ? (
            <ProductsFirstLoad />
          ) : (
            <ProductsNotFirstLoad currQuer={queryThing} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
