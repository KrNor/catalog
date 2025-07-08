import { useForm, Controller } from "react-hook-form";
import { productSchema, type ProductSchemaType } from "../../validation";
import { Form, Button, Alert } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { NumericFormat } from "react-number-format";

import {
  CategorySelectInForm,
  CreateAndSelectTags,
} from "./reusableComponents";

import { useCreateProductMutation } from "../../reducers/apiReducer";

const CreateProduct = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [CreateProduct, { isLoading: isSubmitting }] =
    useCreateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    // watch,
    setValue,
    formState: { errors }, //isValid
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      identifier: "",
      descriptionShort: "",
      descriptionLong: "",
      tags: [],
      category: "",
      price: 0.0,
    },
  });
  // console.log("Is form valid:", isValid);
  // console.log("Form values:", watch());

  const onSubmit = async (formData: ProductSchemaType) => {
    try {
      await CreateProduct({
        name: formData.name,
        price: formData.price,
        availability: formData.availability,
        identifier: formData.identifier,
        descriptionShort: formData.descriptionShort,
        descriptionLong: formData.descriptionLong,
        category: formData.category,
        tags: formData.tags,
      }).unwrap();
      reset();

      setErrorMessage("New Product successfully created!");
    } catch (err: unknown) {
      console.error("Failed to create product:", err);
      const fetchErr = err as FetchBaseQueryError;
      if (
        fetchErr.data &&
        typeof fetchErr.data === "object" &&
        "error" in fetchErr.data
      ) {
        setErrorMessage(fetchErr.data.error as string);
      } else {
        setErrorMessage("An unknown error occurred while creating product.");
      }
    }
  };
  return (
    <div>
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Product name:</Form.Label>
          <Form.Control
            {...register("name", { minLength: 3, maxLength: 125 })}
            placeholder="Name for the product"
          />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product price:</Form.Label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => {
              return (
                <NumericFormat
                  className="form-control"
                  decimalScale={2}
                  fixedDecimalScale
                  value={(field.value / 100).toFixed(2)}
                  onValueChange={(values) => {
                    // console.log(values, sourceInfo);
                    const floatValue = parseFloat(values.value);
                    const cents = Math.round(floatValue * 100);
                    setValue("price", cents);
                  }}
                />
              );
            }}
          />
          {errors.price && (
            <Form.Text className="text-danger">
              {errors.price.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product avaliability from starting from -4 :</Form.Label>
          <Form.Control
            type="number"
            {...register("availability", { min: -4, valueAsNumber: true })}
            placeholder="avaliability"
          />
          {errors.availability && (
            <Form.Text className="text-danger">
              {errors.availability.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>identifier #:</Form.Label>
          <Form.Control
            {...register("identifier", { maxLength: 30 })}
            placeholder="identifier code"
          />
          {errors.identifier && (
            <Form.Text className="text-danger">
              {errors.identifier.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product short description:</Form.Label>
          <Form.Control
            {...register("descriptionShort", { minLength: 3, maxLength: 255 })}
            placeholder="short description"
          />
          {errors.descriptionShort && (
            <Form.Text className="text-danger">
              {errors.descriptionShort.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product long description:</Form.Label>
          <Form.Control
            as="textarea"
            {...register("descriptionLong", { minLength: 3, maxLength: 2000 })}
            placeholder="long description"
          />
          {errors.descriptionLong && (
            <Form.Text className="text-danger">
              {errors.descriptionLong.message}
            </Form.Text>
          )}
        </Form.Group>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategorySelectInForm
              currentCategory={field.value}
              onChange={field.onChange}
              error={errors.category}
            />
          )}
        />
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <CreateAndSelectTags
              selectedTags={field.value}
              onChange={field.onChange}
              setErrorMessage={setErrorMessage}
            />
          )}
        />
        <Button type="submit">
          {isSubmitting ? "Creating..." : "Create a Product"}
        </Button>
      </Form>
    </div>
  );
};

export default CreateProduct;
