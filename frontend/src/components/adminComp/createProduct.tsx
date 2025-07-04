import { useForm } from "react-hook-form";
import { productSchema, type ProductSchemaType } from "../../validation";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ZodError } from "zod";

// todo:
// 1. Delete button next to currently selected tags.
// 2. Price should show dot(like "100.00", probably always "0.00".) when inputing.
// 3. Cleanup/splitting into smaller elements

import {
  useGetCategoryFamilyQuery,
  useCreateProductMutation,
  useGetAllTagsQuery,
  useCreateTagMutation,
} from "../../reducers/apiReducer";
import type { CategoryToReturn, TagToSave } from "../../types";
import {
  tagInsideProductSchema,
  type TagWithIdSchemaType,
} from "../../validation";

const CreateProduct = () => {
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const [currentTag, setCurrentTag] = useState<TagToSave>({
    tagName: "",
    tagAttribute: "",
  });

  const [tobeCreatedTag, setTobeCreatedTag] = useState<TagToSave>({
    tagName: "",
    tagAttribute: "",
  });

  const [selectedTags, setSelectedTags] = useState<TagToSave[]>([]);
  const [currentTagAttributes, setCurrentTagAttributes] = useState<string[]>(
    []
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tagSetButtonDisabled, setTagSetButtonDisabled] =
    useState<boolean>(true);

  const {
    data: lineage,
    isError,
    isLoading,
  } = useGetCategoryFamilyQuery(currentCategory);

  const {
    data: tagData,
    isError: tagError,
    isLoading: tagLoading,
  } = useGetAllTagsQuery();

  const [CreateProduct, { isLoading: isSubmitting }] =
    useCreateProductMutation();

  const [CreateTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  const {
    register,
    handleSubmit,
    reset,
    // watch,
    formState: { errors }, //isValid
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      identifier: "",
      descriptionShort: "",
      descriptionLong: "",
      tags: selectedTags,
      category: "",
    },
  });
  // console.log("Is form valid:", isValid);
  // console.log("Form values:", watch());
  if (isLoading || lineage === undefined || tagLoading || tagData === undefined)
    return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;
  if (tagError) return <Alert variant="danger">Error fetching tags</Alert>;

  const handleBackCategory = () => {
    if (lineage.lineage.length === 0) {
      setCurrentCategory("");
    } else {
      const newCurrent = lineage.lineage[lineage.lineage.length - 1];

      setCurrentCategory(newCurrent.id);
    }
  };

  const handleSelectCategory = (id: string) => {
    setCurrentCategory(id);
  };

  const handleSelectTagName = (name: string) => {
    setCurrentTag({ tagName: name, tagAttribute: "" });
    setTobeCreatedTag({ tagName: name, tagAttribute: "" });
    setTagSetButtonDisabled(true);
    const selectedTag = tagData.find((tag) => tag.tagName === name);
    if (selectedTag === undefined || selectedTag.tagAttributes === undefined) {
      setErrorMessage(
        "something went horribly wrong finding the tag you selected"
      );
    } else {
      setCurrentTagAttributes(selectedTag.tagAttributes);
    }
  };
  const handleSelectTagAttribute = (tagAttribute: string) => {
    setTagSetButtonDisabled(false);
    setCurrentTag({ tagName: currentTag.tagName, tagAttribute: tagAttribute });
  };

  const handleTagAdd = (tagToAddObject: TagToSave) => {
    setTagSetButtonDisabled(true);
    if (tagToAddObject.tagName !== "" && tagToAddObject.tagAttribute !== "") {
      const tagToAdd = selectedTags.find(
        (tag) => tag.tagName === tagToAddObject.tagName
      );
      if (tagToAdd !== undefined) {
        const updatedTags = selectedTags.map((tag) =>
          tag.tagName === tagToAddObject.tagName ? tagToAddObject : tag
        );
        setSelectedTags(updatedTags);
      } else {
        setSelectedTags([...selectedTags, tagToAddObject]);
      }
    } else {
      setErrorMessage("Select a tag and an attribute to fully add it.");
    }
  };

  const handleTagCreate = async () => {
    setTagSetButtonDisabled(true);
    try {
      const parseResult:
        | { success: true; data: TagToSave }
        | { success: false; error: ZodError } =
        tagInsideProductSchema.safeParse(tobeCreatedTag);
      if (parseResult.success) {
        await CreateTag(tobeCreatedTag).unwrap();
        handleTagAdd(tobeCreatedTag);
        setCurrentTagAttributes([]);
      } else {
        setErrorMessage(
          "When creating tags: " + parseResult.error.issues[0].message
        );
      }
    } catch (err: unknown) {
      console.error("Failed to create tag:", err);
      const fetchErr = err as FetchBaseQueryError;
      if (
        fetchErr.data &&
        typeof fetchErr.data === "object" &&
        "error" in fetchErr.data
      ) {
        setErrorMessage(fetchErr.data.error as string);
      } else {
        setErrorMessage("An unknown error occurred while creating tag.");
      }
    }
  };

  const onSubmit = async (formData: ProductSchemaType) => {
    try {
      if (currentCategory && lineage.category[0]) {
        await CreateProduct({
          name: formData.name,
          price: formData.price,
          availability: formData.availability,
          identifier: formData.identifier,
          descriptionShort: formData.descriptionShort,
          descriptionLong: formData.descriptionLong,
          category: currentCategory,
          tags: selectedTags,
        }).unwrap();
        reset();
        // reseting curent tags and category not needed here? might just make making similar products more of a hassle.
        setErrorMessage("New Product successfully created!");
      } else {
        setErrorMessage("Product not saved select a category!");
      }
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
        setErrorMessage("An unknown error occurred while saving.");
      }
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
          <Form.Control
            type="number"
            pattern="\d*"
            placeholder="Product price"
            {...register("price", { min: 0, valueAsNumber: true })}
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
        {errors.category && !currentCategory && (
          <Form.Text className="text-danger">
            {errors.category.message}
          </Form.Text>
        )}

        <Form.Label>select category:</Form.Label>
        <Form.Group className="mb-3">
          <Button onClick={handleBackCategory}>Back</Button>
        </Form.Group>
        <div className="d-flex justify-content-around">
          <Form.Select
            onChange={(e) => handleSelectCategory(e.target.value)}
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

        <div className="d-flex justify-content-around">
          <Form.Select
            htmlSize={5}
            onChange={(e) => handleSelectTagName(e.target.value)}
            defaultValue=""
          >
            <option disabled value="">
              Select a Tag
            </option>
            {tagData.map((child: TagWithIdSchemaType) => (
              <option key={child.id} value={child.tagName}>
                {child.tagName}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            htmlSize={5}
            onChange={(e) => handleSelectTagAttribute(e.target.value)}
            defaultValue=""
          >
            <option disabled value="">
              Select attribute
            </option>
            {currentTagAttributes.map((child: string) => (
              <option key={child} value={child}>
                {child}
              </option>
            ))}
          </Form.Select>
          <Button
            disabled={tagSetButtonDisabled}
            onClick={() => handleTagAdd(currentTag)}
          >
            Add selected tag
          </Button>
        </div>
        <div className="d-flex justify-content-around">
          <Form.Control
            onChange={(e) =>
              setTobeCreatedTag({
                tagName: e.target.value,
                tagAttribute: tobeCreatedTag.tagAttribute,
              })
            }
            value={tobeCreatedTag.tagName}
          ></Form.Control>
          <Form.Control
            onChange={(e) =>
              setTobeCreatedTag({
                tagName: tobeCreatedTag.tagName,
                tagAttribute: e.target.value,
              })
            }
            value={tobeCreatedTag.tagAttribute}
          ></Form.Control>
          <Button onClick={handleTagCreate}>
            {isCreatingTag ? "Creating..." : "Create and add tag"}
          </Button>
        </div>

        {errors.descriptionLong && (
          <Form.Text className="text-danger">
            {errors.descriptionLong.message}
          </Form.Text>
        )}

        <div>
          {selectedTags.length > 0 ? (
            selectedTags.map((selTag: TagToSave) => (
              <div key={`${selTag.tagName}tag`}>
                {selTag.tagName}: {selTag.tagAttribute}
              </div>
            ))
          ) : (
            <div>no tags currently selected</div>
          )}
        </div>
        <Button type="submit">
          {isSubmitting ? "Creating..." : "Create a Product"}
        </Button>
      </Form>
    </div>
  );
};

export default CreateProduct;
