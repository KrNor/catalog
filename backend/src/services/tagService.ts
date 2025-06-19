import Tag, { TagDocument } from "../models/tag";
// import Category from "../models/category";
import { TagWithArray, TagInsideProduct } from "../types";

export const createTag = async (
  object: TagInsideProduct
): Promise<TagDocument> => {
  const tagToDoThings = await Tag.findOne<TagDocument>({
    tagName: object.tagName,
  }).exec();

  if (tagToDoThings) {
    if (
      tagToDoThings.tagAttributes &&
      !tagToDoThings.tagAttributes.includes(object.tagAttribute)
    ) {
      tagToDoThings.tagAttributes.push(object.tagAttribute);
      await tagToDoThings.save();
    }
    return tagToDoThings;
  } else {
    const newTag: TagDocument = new Tag({
      ...object,
      tagAttributes: [object.tagAttribute],
    });
    await newTag.save();

    return newTag;
  }
};

export const getAllTags = async (): Promise<TagDocument[]> => {
  const allTags: TagDocument[] = await Tag.find(
    {},
    "tagName tagAttributes id"
  ).exec();
  return allTags;
};

export const getTagByName = async (
  nameOfTag: string
): Promise<TagWithArray | null> => {
  const wantedTag = await Tag.findOne<TagDocument>({
    tagName: nameOfTag,
  }).exec();
  if (wantedTag) {
    wantedTag.toJSON();
    return wantedTag;
  }
  return wantedTag;
};

export const deleteTag = async (
  object: TagInsideProduct
): Promise<TagDocument | null> => {
  const wantedTag = await Tag.findOneAndUpdate<TagDocument>(
    {
      tagName: object.tagName,
      tagAttributes: object.tagAttribute,
    },
    {
      $pull: {
        tagAttributes: object.tagAttribute,
      },
    }
  );
  if (wantedTag === null) {
    return null;
  }
  // replace with 1 call to do both later ( or might not be possible)
  const wantedTag2 = await Tag.findOne<TagDocument>({
    tagName: object.tagName,
  });

  if (wantedTag2) {
    if (wantedTag2.tagAttributes.length < 1) {
      await Tag.deleteOne({ tagName: object.tagName });
    }
  }

  return wantedTag;
};
