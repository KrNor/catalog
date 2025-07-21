import { Spinner, Alert, FormCheck } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import { useGetFilteredTagsQuery } from "../reducers/apiReducer";

interface SidebarTagProps {
  selectedTags: Record<string, string[]>;
  tagClick: (key: string, value: string) => void;
}

const SidebarTags = ({ selectedTags, tagClick }: SidebarTagProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tagSideLength, _setTagSideLength] = useState<number>(20); // temp

  const [searchParams] = useSearchParams();

  const queryString = searchParams.toString();

  const {
    data: tagData,
    error: tagError,
    isLoading: tagLoading,
  } = useGetFilteredTagsQuery(queryString);

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
  //   console.log("this is selected tags");
  //   console.log(selectedTags);

  const onTagSelect = (tag: string, tagAtt: string) => {
    tagClick(tag, tagAtt);
  };

  return (
    <div>
      {tagData ? (
        tagData.map((tag, tagIndex) => {
          if (tagIndex < tagSideLength) {
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
                          defaultChecked={
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
    </div>
  );
};

export default SidebarTags;
