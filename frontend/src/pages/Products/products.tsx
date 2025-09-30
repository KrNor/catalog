import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "@/redux/productEndpoints";
import { useGetCategoryFamilyQuery } from "@/redux/categoryEndpoints";
import ProductListings from "@/pages/Products/productListings";
import ProductSidebar from "@/pages/Products/ProductSidebar/productSidebar";

const Products = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const {
    data: currentProducts,
    error,
    isLoading,
  } = useGetProductsQuery(queryString);

  const categoryy = searchParams.get("category");

  const {
    data: lineage,
    isError: categoryError,
    isLoading: categoryLoading,
  } = useGetCategoryFamilyQuery(categoryy || undefined);

  if (isLoading || categoryLoading || !lineage) {
    return <Spinner animation="border" />;
  }

  if (error || categoryError) {
    return (
      <Alert variant="danger">
        error occured when getting products, try again later.
      </Alert>
    );
  }

  if (currentProducts) {
    return (
      <Container>
        <Row>
          <Col sm={2}>
            <ProductSidebar />
          </Col>
          <Col sm={10}>
            <ProductListings
              currentProducts={currentProducts}
              lineage={lineage}
            />
          </Col>
        </Row>
      </Container>
    );
  }
};
export default Products;
