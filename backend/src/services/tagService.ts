import Tag from "../models/tag";
// import Category from "../models/category";
import { zodTagToSaveType } from "../types";

export const createTag = async (object: zodTagToSaveType) => {
  const tagToSave = {
    ...object,
  };
  const tagToDoThings = await getTagByName(tagToSave.tagName);
  console.log(tagToSave);

  if (tagToDoThings) {
    if (!tagToDoThings.tagAttributes.includes(tagToSave.tagAttribute)) {
      tagToDoThings.tagAttributes.push(tagToSave.tagAttribute);
      await tagToDoThings.save();
    }
    return tagToDoThings;
  } else {
    const new_tag = new Tag({
      ...tagToSave,
      tagAttributes: [tagToSave.tagAttribute],
    });
    await new_tag.save();
    return new_tag;
  }
};

export const getAllTags = async () => {
  const allTags = await Tag.find({}, "tagName tagAttributes id");
  return allTags;
};

export const getTagByName = async (nameOfTag: string) => {
  const wantedTag = await Tag.findOne({ tagName: nameOfTag }).exec();
  // console.log(wantedTag);
  return wantedTag;
};

// export const getTagById = async (idOfTag: string) => {
//   const wantedTag = await Tag.findById(idOfTag).exec();
//   // console.log(wantedTag);
//   return wantedTag;
// };

export const deleteTag = async (object: zodTagToSaveType) => {
  const wantedTag = await Tag.findOneAndUpdate(
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

  // replace with 1 call to do both later
  const wantedTag2 = await Tag.findOne({
    tagName: object.tagName,
  });

  if (wantedTag2) {
    if (wantedTag2.tagAttributes.length < 1) {
      await Tag.deleteOne({ tagName: object.tagName });
    }
  }

  return wantedTag;
};
