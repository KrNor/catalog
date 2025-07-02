import { useForm } from "react-hook-form";
// import { skipToken } from "@reduxjs/toolkit/query/react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  useGetCategoryFamilyQuery,
  useCreateCategoryMutation,
} from "../../reducers/apiReducer";
import type { CategoryToReturn } from "../../types";
import {
  createCategorySchema,
  type CategorySchemaType,
} from "../../validation";

const CreateCategory = () => {
  const [currentParent, setCurrentParent] = useState<string | undefined>(
    undefined
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: lineage,
    isError,
    isLoading,
  } = useGetCategoryFamilyQuery(currentParent);

  const [createCategory, { isLoading: isSubmitting }] =
    useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  if (isLoading || lineage === undefined) return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;

  const handleBackParent = () => {
    if (lineage.lineage.length === 0) {
      setCurrentParent(undefined);
    } else {
      const newCurrent = lineage.lineage[lineage.lineage.length - 1];

      setCurrentParent(newCurrent.id);
    }
  };

  const handleSelectChild = (id: string) => {
    setCurrentParent(id);
  };

  const onSubmit = async (formData: CategorySchemaType) => {
    try {
      if (lineage.category[0]) {
        await createCategory({
          name: formData.name,
          description: formData.description,
          parent: lineage.category[0].id,
        }).unwrap();
      } else {
        await createCategory({
          name: formData.name,
          description: formData.description,
        }).unwrap();
      }
      reset();
      setErrorMessage("New Category successfully created!");
    } catch {
      console.error("There was a problem with creating the category");
      setErrorMessage("There was a problem with creating the category");
    }
  };

  return (
    <div>
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(null)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Category name:</Form.Label>
          <Form.Control
            {...register("name", { minLength: 3, maxLength: 125 })}
            placeholder="Category Name"
          />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description name:</Form.Label>
          <Form.Control
            as="textarea"
            {...register("description", { minLength: 3, maxLength: 225 })}
            placeholder="Description"
          />
          {errors.description && (
            <Form.Text className="text-danger">
              {errors.description.message}
            </Form.Text>
          )}
        </Form.Group>

        <div className="d-flex justify-content-around">
          <Form.Label>current category:</Form.Label>

          <Form.Group className="mb-3">
            <Form.Label>
              {lineage.category[0]
                ? lineage.category[0].name
                : "no category selected"}
            </Form.Label>
          </Form.Group>
        </div>

        <Form.Label>select parent category:</Form.Label>
        <Form.Group className="mb-3">
          <Button onClick={handleBackParent}>Back</Button>
        </Form.Group>
        <div className="d-flex justify-content-around">
          <Form.Select
            onChange={(e) => handleSelectChild(e.target.value)}
            defaultValue=""
          >
            <option value="">Select a category</option>
            {lineage.imediateChildren.map((child: CategoryToReturn) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </Form.Select>
        </div>
        <Button type="submit">
          {isSubmitting ? "Creating..." : "Create a Category"}
        </Button>
      </Form>
    </div>
  );
};

export default CreateCategory;
