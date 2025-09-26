import {
  Container,
  Row,
  Col,
  Navbar,
  Form,
  // Breadcrumb,
} from "react-bootstrap";

interface ProductSortingAndInfoProps {
  categoryName: string;
  productCount: number;
  onChange: (value: string) => void;
}

export const ProductSortingAndInfo = ({
  categoryName,
  productCount,
  onChange,
}: ProductSortingAndInfoProps) => {
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

export default ProductSortingAndInfo;
