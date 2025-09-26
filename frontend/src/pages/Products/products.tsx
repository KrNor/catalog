import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  useGetProductsQuery,
  useGetCategoryFamilyQuery,
} from "../../redux/apiReducer";

import { ProductCard } from "./productCard";
import { ProductPagination } from "./productPagination";
import { ProductSortingAndInfo } from "../../components/filtersort/productSortAndInfo";

import SearchFilters from "./searchFilters";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryString = searchParams.toString();

  const { data, error, isLoading } = useGetProductsQuery(queryString);

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
  const setCurrentPage = (currentPage: string) => {
    if (currentPage === "") {
      searchParams.delete("currentPage");
    } else {
      searchParams.set("currentPage", currentPage);
    }
    navigate(`/products?${searchParams.toString()}`);
  };

  const setResultsPerPage = (resultsPerPage: string) => {
    if (resultsPerPage === "") {
      searchParams.delete("resultsPerPage");
    } else {
      searchParams.set("resultsPerPage", resultsPerPage);
    }
    searchParams.set("currentPage", "1");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    navigate(`/products?${searchParams.toString()}`);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const setSortType = (sortType: string) => {
    if (sortType === "") {
      searchParams.delete("sortType");
    } else {
      searchParams.set("sortType", sortType);
    }
    navigate(`/products?${searchParams.toString()}`);
  };

  if (data) {
    return (
      <Container>
        <Row>
          <Col sm={2}>
            <SearchFilters />
          </Col>
          <Col sm={10}>
            <Container>
              {/* not using here for now */}
              {/* <Row>
                <CategorySelectLineage
                  onChange={setCurrentCategory}
                  lineage={lineage}
                />
              </Row> */}
              <Row>
                <ProductSortingAndInfo
                  categoryName={
                    lineage.category[0] ? lineage.category[0].name : "all"
                  }
                  productCount={data.productCount}
                  onChange={setSortType}
                />
              </Row>
              <Row>
                {data.data.map((product) => (
                  <Col
                    key={product.id}
                    xs={12} // 1 product per row on extra small screens
                    sm={6} // 2 products per row on small screens
                    md={4} // 3 products per row on medium screens
                    lg={3} // 4 products per row on large screens
                    xl={2} // 6 products per row on extra large screens
                    className="mb-4 d-flex"
                  >
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              <Row>
                <ProductPagination
                  resultsPerPage={data.resultsPerPage}
                  productCount={data.productCount}
                  currentPage={data.currentPage}
                  onChange={setResultsPerPage}
                  setCurrentPage={setCurrentPage}
                />
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
};
export default Products;
