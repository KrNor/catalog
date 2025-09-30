import { useState } from "react";
import { Button, Card, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} from "@/redux/categoryEndpoints";
import type { FullCategoryObject } from "@/types/category";

const CategoryManager = () => {
  const { data: categories, isLoading, isError } = useGetAllCategoriesQuery();
  const [editCategory, { isLoading: isEditing }] = useEditCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEditClick = (category: FullCategoryObject) => {
    setEditingId(category.id);
    setEditedDescription(category.description);
    setErrorMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedDescription("");
    setErrorMessage(null);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await editCategory({
        id,
        description: editedDescription,
      }).unwrap();
      setEditingId(null);
      setEditedDescription("");
      setErrorMessage(null);
    } catch (err: unknown) {
      console.error("Failed to save product:", err);
      const fetchErr = err as FetchBaseQueryError;
      if (
        fetchErr.data &&
        typeof fetchErr.data === "object" &&
        "error" in fetchErr.data
      ) {
        setErrorMessage(fetchErr.data.error as string);
      } else {
        setErrorMessage("An unknown error occurred while saving.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
      } catch (err: unknown) {
        console.error("Failed to delete category:", err);
        const fetchErr = err as FetchBaseQueryError;
        if (
          fetchErr.data &&
          typeof fetchErr.data === "object" &&
          "error" in fetchErr.data
        ) {
          setErrorMessage(fetchErr.data.error as string);
        } else {
          setErrorMessage(
            "An unknown error occurred while trying to delete a category."
          );
        }
      }
    }
  };

  if (isLoading) return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;

  return (
    <div className="container mt-4">
      <h2>Category List</h2>
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(null)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}

      <Row>
        {categories?.map((category: FullCategoryObject) => (
          <Col md={6} lg={4} key={category.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  ID: {category.id}
                </Card.Subtitle>

                {editingId === category.id ? (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                    <div className="mt-2 d-flex justify-content-between">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleSaveEdit(category.id)}
                        disabled={isEditing}
                      >
                        {isEditing ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Card.Text>{category.description}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditClick(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryManager;
