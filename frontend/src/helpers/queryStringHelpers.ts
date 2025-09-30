import qs, { type ParsedQs } from "qs";

import { type TagInSearchSchemaType } from "@/schemas/tagSchema";

export const getSringFromTagObject = (
  tagObj: Record<string, string[]>
): string => {
  const resultString = qs.stringify(
    {
      tags: tagObj,
    },
    { arrayFormat: "repeat", allowDots: true }
  );

  return resultString;
};

export const getObjectFromQs = (
  qsResult: ParsedQs
): Record<string, string[]> => {
  const tags: Record<string, string[]> = {};

  if (
    qsResult.tags &&
    typeof qsResult.tags === "object" &&
    !Array.isArray(qsResult.tags)
  ) {
    Object.entries(qsResult.tags).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          tags[key] = value.filter(
            (attrs): attrs is string => typeof attrs === "string"
          );
        } else if (typeof value === "string") {
          tags[key] = [value];
        }
      }
    });
  }

  return tags;
};

export const getObjectFromTagString = (
  tagString: string
): Record<string, string[]> => {
  const resultObj = qs.parse(tagString, {
    allowDots: true,
  });

  const realResult = getObjectFromQs(resultObj);

  return realResult;
};

export const getTagsFromUrl = (
  searchParams: URLSearchParams
): TagInSearchSchemaType => {
  let temp = "";

  searchParams.forEach((val, keyy) => {
    if (keyy.startsWith("tags")) {
      temp += `${keyy}=${val}&`;
    }
  });

  if (temp.length > 1) {
    temp = temp.substring(0, temp.length - 1);
    const usableTag = getObjectFromTagString(temp);
    return { tags: usableTag };
  } else {
    return { tags: {} };
  }
};
