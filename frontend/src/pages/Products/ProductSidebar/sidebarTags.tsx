import { Spinner, Alert, FormCheck, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useGetFilteredTagsQuery } from "@/redux/apiReducer";
import { getTagsFromUrl } from "@/helpers/queryStringHelpers";

interface SidebarTagProps {
  selectedTags: Record<string, string[]>;
  tagClick: (key: string, value: string) => void;
}

const SidebarTags = ({ selectedTags, tagClick }: SidebarTagProps) => {
  const [tagSideLength, setTagSideLength] = useState<number>(5);

  const [searchParams] = useSearchParams();

  const queryString = searchParams.toString();

  const {
    data: tagData,
    error: tagError,
    isLoading: tagLoading,
  } = useGetFilteredTagsQuery(queryString);

  const [initialTags, setInitialTags] = useState<Record<string, string[]>>();

  useEffect(() => {
    const tagsToUse = getTagsFromUrl(searchParams);
    setInitialTags(tagsToUse.tags);
  }, [searchParams]);

  if (tagLoading) {
    return <Spinner animation="border" />;
  }

  if (tagError) {
    return (
      <Alert variant="danger">
        error occured when getting products, try again later.
      </Alert>
    );
  }

  const onTagSelect = (tag: string, tagAtt: string) => {
    tagClick(tag, tagAtt);
  };

  const increaseTagAmmount = () => {
    setTagSideLength(tagSideLength + 5);
  };

  return (
    <div>
      {tagData && initialTags ? (
        tagData.map((tag, tagIndex) => {
          if (tag.tagName in initialTags) {
            return (
              <fieldset key={`${tag.tagName}tag${tagIndex}`}>
                <div key={`${tag.tagName}tagname`}>
                  {">>>"}
                  {tag.tagName}:{tag.count}
                </div>
                <div key={`tagattributetemp`}>
                  {tag.attributes.map((tagAtt) => {
                    return (
                      <FormCheck key={`${tagAtt.tagAttribute}`}>
                        <FormCheck.Input
                          onChange={() =>
                            onTagSelect(tag.tagName, tagAtt.tagAttribute)
                          }
                          checked={
                            Object.prototype.hasOwnProperty.call(
                              selectedTags,
                              tag.tagName
                            ) && selectedTags
                              ? selectedTags[tag.tagName].includes(
                                  tagAtt.tagAttribute
                                )
                              : false
                          }
                          type="checkbox"
                        ></FormCheck.Input>
                        <FormCheck.Label>
                          {tagAtt.tagAttribute}:{tagAtt.count}
                        </FormCheck.Label>
                      </FormCheck>
                    );
                  })}
                </div>
              </fieldset>
            );
          }
        })
      ) : (
        <div>loading</div>
      )}
      {tagData && initialTags ? (
        tagData.map((tag, tagIndex) => {
          if (tagIndex < tagSideLength && !(tag.tagName in initialTags)) {
            return (
              <fieldset key={`${tag.tagName}`}>
                <div key={`${tag.tagName}tagname`}>
                  {">"}
                  {tag.tagName}:{tag.count}
                </div>
                <div key={`tagattributetemp`}>
                  {tag.attributes.map((tagAtt) => {
                    return (
                      <FormCheck key={`${tagAtt.tagAttribute}`}>
                        <FormCheck.Input
                          onChange={() =>
                            onTagSelect(tag.tagName, tagAtt.tagAttribute)
                          }
                          type="checkbox"
                        ></FormCheck.Input>
                        <FormCheck.Label>
                          {tagAtt.tagAttribute}:{tagAtt.count}
                        </FormCheck.Label>
                      </FormCheck>
                    );
                  })}
                </div>
              </fieldset>
            );
          }
        })
      ) : (
        <div>loading</div>
      )}
      <Button onClick={() => increaseTagAmmount()}>show more tags</Button>
    </div>
  );
};

export default SidebarTags;
