import {
  Container,
  Row,
  Card,
  Col,
  Alert,
  Spinner,
  Navbar,
  Form,
  Pagination,
  // Breadcrumb,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  useGetProductsQuery,
  useGetCategoryFamilyQuery,
} from "../reducers/apiReducer";
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

interface CategoryInfoAndSortingProps {
  categoryName: string;
  productCount: number;
  onChange: (value: string) => void;
}

const CategoryInfoAndSorting = ({
  categoryName,
  productCount,
  onChange,
}: CategoryInfoAndSortingProps) => {
  return (
    <Container>
      <Navbar>
        <Row>
          <Col>{categoryName}</Col>
          <Col>total products found:{productCount}</Col>
          <Col>
            <Form.Select onChange={(e) => onChange(e.target.value)}>
              <option value="">Sort by:</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priceAsc">Increasing Price </option>
              <option value="priceDesc">Decreasing Price</option>
              <option value="nameAZ">A to Z</option>
              <option value="nameZA">Z to A</option>
            </Form.Select>
          </Col>
        </Row>
      </Navbar>
    </Container>
  );
};
interface ProductPaginationProps {
  resultsPerPage: number;
  productCount: number;
  currentPage: number;
  onChange: (value: string) => void;
  setCurrentPage: (value: string) => void;
}
const ProductPagination = ({
  resultsPerPage,
  productCount,
  currentPage,
  onChange,
  setCurrentPage,
}: ProductPaginationProps) => {
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(productCount / resultsPerPage)
  );
  // console.log(pageCount + " of pages are total ");

  useEffect(() => {
    setPageCount(Math.ceil(productCount / resultsPerPage));
  }, [resultsPerPage, productCount, currentPage]);
  return (
    <Container>
      <Navbar>
        <Row>
          <Col>
            <Pagination>
              {currentPage > 3 ? (
                <Pagination.Item onClick={() => setCurrentPage("1")}>
                  1
                </Pagination.Item>
              ) : null}
              {currentPage > 3 ? (
                <Pagination.Prev
                  onClick={() => setCurrentPage((currentPage - 1).toString())}
                />
              ) : null}

              {currentPage > 2 ? (
                <Pagination.Item
                  onClick={() => setCurrentPage((currentPage - 2).toString())}
                >
                  {currentPage - 2}
                </Pagination.Item>
              ) : null}
              {currentPage > 1 ? (
                <Pagination.Item
                  onClick={() => setCurrentPage((currentPage - 1).toString())}
                >
                  {currentPage - 1}
                </Pagination.Item>
              ) : null}

              <Pagination.Item active>{currentPage}</Pagination.Item>

              {currentPage < pageCount ? (
                <Pagination.Item
                  onClick={() => setCurrentPage((currentPage + 1).toString())}
                >
                  {currentPage + 1}
                </Pagination.Item>
              ) : null}
              {currentPage < pageCount - 1 ? (
                <Pagination.Item
                  onClick={() => setCurrentPage((currentPage + 2).toString())}
                >
                  {currentPage + 2}
                </Pagination.Item>
              ) : null}
              {currentPage < pageCount - 2 ? (
                <Pagination.Next
                  onClick={() => setCurrentPage((currentPage + 1).toString())}
                />
              ) : null}
              {currentPage < pageCount - 2 ? (
                <Pagination.Item
                  onClick={() => setCurrentPage(pageCount.toString())}
                >
                  {pageCount}
                </Pagination.Item>
              ) : null}
            </Pagination>
          </Col>
          <Col>
            <Form.Select
              defaultValue={resultsPerPage.toString()}
              onChange={(e) => onChange(e.target.value)}
            >
              {["", "20", "40", "60", "120", "200"].map((val) => {
                return (
                  <option key={val + "select"} value={val}>
                    {val}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>
      </Navbar>
    </Container>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryString = searchParams.toString();

  const { data, error, isLoading } = useGetProductsQuery(queryString);

  const categoryy = searchParams.get("category");
  // console.log(searchParams);
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
                <CategoryInfoAndSorting
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
                    <SingleProduct product={product} />
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
