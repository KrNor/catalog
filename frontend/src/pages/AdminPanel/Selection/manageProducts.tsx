import { Row, Container, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useState } from "react";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../redux/apiReducer";

const ManageProducts = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data, error, isLoading } = useGetProductsQuery("");
  const [DeleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await DeleteProduct(id).unwrap();
      } catch (err: unknown) {
        console.error("Failed to delete product:", err);
        const fetchErr = err as FetchBaseQueryError;
        if (
          fetchErr.data &&
          typeof fetchErr.data === "object" &&
          "error" in fetchErr.data
        ) {
          setErrorMessage(fetchErr.data.error as string);
        } else {
          setErrorMessage(
            "An unknown error occurred while trying to delete a product."
          );
        }
      }
    }
  };

  return (
    <Container>
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
          {errorMessage}
        </Alert>
      )}
      {data?.data.map((product) => (
        <Row key={product.id} className="mx-auto p-2 border border-primary">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">{product.name}</div>
            <div className="d-flex">
              <Button
                className="me-2"
                variant="primary"
                size="sm"
                onClick={() => navigate(`/panel/manageProducts/${product.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(product.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Row>
      ))}
    </Container>
  );
};

export default ManageProducts;
