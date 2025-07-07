import type { FieldError } from "react-hook-form";
import { Form, Button, Alert, Spinner, ListGroup } from "react-bootstrap";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ZodError } from "zod";
import { useState, type Dispatch, type SetStateAction } from "react";

import {
  useGetCategoryFamilyQuery,
  useGetAllTagsQuery,
  useCreateTagMutation,
} from "../../reducers/apiReducer";
import type { CategoryToReturn, TagToSave } from "../../types";
import {
  tagInsideProductSchema,
  type TagWithIdSchemaType,
} from "../../validation";

interface CategorySelectProps {
  currentCategory: string;
  onChange: (value: string) => void;
  error: FieldError | undefined;
}

interface CreateAndSelectTagsProps {
  selectedTags: TagToSave[];
  onChange: (value: TagToSave[]) => void;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export const CategorySelect = ({
  currentCategory = "",
  onChange,
  error,
}: CategorySelectProps) => {
  const {
    data: lineage,
    isError,
    isLoading,
  } = useGetCategoryFamilyQuery(currentCategory);

  if (isError) return <Alert variant="danger">Error fetching categories</Alert>;

  if (isLoading || lineage === undefined) return <Spinner animation="border" />;

  const handleBackCategory = () => {
    if (lineage.lineage.length === 0) {
      onChange("");
    } else {
      const newCurrent = lineage.lineage[lineage.lineage.length - 1];
      onChange(newCurrent.id);
    }
  };

  const handleSelectCategory = (id: string) => {
    onChange(id);
  };

  return (
    <div>
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
      {error && <Form.Text className="text-danger">{error.message}</Form.Text>}
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
    </div>
  );
};

export const CreateAndSelectTags = ({
  selectedTags,
  onChange,
  setErrorMessage,
}: CreateAndSelectTagsProps) => {
  const [currentTag, setCurrentTag] = useState<TagToSave>({
    tagName: "",
    tagAttribute: "",
  });

  const [tobeCreatedTag, setTobeCreatedTag] = useState<TagToSave>({
    tagName: "",
    tagAttribute: "",
  });

  const [currentTagAttributes, setCurrentTagAttributes] = useState<string[]>(
    []
  );

  const [tagSetButtonDisabled, setTagSetButtonDisabled] =
    useState<boolean>(true);

  const [CreateTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  const {
    data: tagData,
    isError: tagError,
    isLoading: tagLoading,
  } = useGetAllTagsQuery();

  if (tagLoading || tagData === undefined)
    return <Spinner animation="border" />;

  if (tagError) return <Alert variant="danger">Error fetching tags</Alert>;

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
        onChange(updatedTags);
      } else {
        onChange([...selectedTags, tagToAddObject]);
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

  const handleDeleteTagFromSelected = async (tagName: string) => {
    const newTagArray = selectedTags.filter((tag) => tag.tagName !== tagName);

    onChange(newTagArray);
  };

  return (
    <div>
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
      <div>
        {selectedTags.length > 0 ? (
          selectedTags.map((selTag: TagToSave) => (
            <ListGroup horizontal key={`${selTag.tagName}tag`}>
              <ListGroup.Item>
                <div>
                  {selTag.tagName}: {selTag.tagAttribute}
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  onClick={() => handleDeleteTagFromSelected(selTag.tagName)}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            </ListGroup>
          ))
        ) : (
          <div>no tags currently selected</div>
        )}
      </div>
    </div>
  );
};
