import { Form, Button, Alert, Spinner, ListGroup } from "react-bootstrap"; // Row
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ZodError } from "zod";
import { useState, type Dispatch, type SetStateAction } from "react";

import { useGetAllTagsQuery, useCreateTagMutation } from "@/redux/tagEndpoints";
import type { TagToSave } from "@/types/tag";
import {
  tagInsideProductSchema,
  type TagWithIdSchemaType,
} from "@/schemas/tagSchema";

interface TagSelectorAndCreatorProps {
  selectedTags: TagToSave[];
  onChange: (value: TagToSave[]) => void;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}
export const TagSelectorAndCreator = ({
  selectedTags,
  onChange,
  setErrorMessage,
}: TagSelectorAndCreatorProps) => {
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
