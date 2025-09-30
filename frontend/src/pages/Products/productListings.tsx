import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ProductCard } from "@/pages/Products/productCard";
import { ProductPagination } from "@/pages/Products/productPagination";
import { ProductFilterSort } from "@/pages/Products/productFilterSort";
import type { CategoryFamilyObject } from "@/types/category";

import type { SimplifiedProductsWithPaginationMeta } from "@/types/product";

interface ProductListingProps {
  currentProducts: SimplifiedProductsWithPaginationMeta;
  lineage: CategoryFamilyObject;
}

export const ProductListings = ({
  currentProducts,
  lineage,
}: ProductListingProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const setSortType = (sortType: string) => {
    if (sortType === "") {
      searchParams.delete("sortType");
    } else {
      searchParams.set("sortType", sortType);
    }
    navigate(`/products?${searchParams.toString()}`);
  };
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
  return (
    <Container>
      <Row>
        <ProductFilterSort
          categoryName={lineage.category[0] ? lineage.category[0].name : "all"}
          productCount={currentProducts.productCount}
          onChange={setSortType}
        />
      </Row>
      <Row>
        {currentProducts.data.map((product) => (
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
          resultsPerPage={currentProducts.resultsPerPage}
          productCount={currentProducts.productCount}
          currentPage={currentProducts.currentPage}
          onChange={setResultsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </Row>
    </Container>
  );
};

export default ProductListings;
