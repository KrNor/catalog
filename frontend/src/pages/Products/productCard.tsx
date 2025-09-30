import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import type { SimplifiedProduct } from "@/types/product";

interface SingleProductProps {
  product: SimplifiedProduct;
}

export const ProductCard = ({ product }: SingleProductProps) => {
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

export default ProductCard;
