import {
  Container,
  Row,
  Col,
  Navbar,
  Form,
  Pagination,
  // Breadcrumb,
} from "react-bootstrap";

import { useEffect, useState } from "react";

interface ProductPaginationProps {
  resultsPerPage: number;
  productCount: number;
  currentPage: number;
  onChange: (value: string) => void;
  setCurrentPage: (value: string) => void;
}

export const ProductPagination = ({
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

export default ProductPagination;
