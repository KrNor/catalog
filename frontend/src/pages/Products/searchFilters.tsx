import { Form, InputGroup, Button, Col, Row } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  searchSchema,
  type SearchSchemaType,
} from "../../schemas/searchSchema";
import { GetTagsFromUrl } from "./reusableFunctions";
import SidebarCategories from "./sidebarCategories";
import SidebarTags from "./sidebarTags";

const SearchFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const methods = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : "",
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : "",
      search: searchParams.get("search") || "",
      availability: searchParams.get("availability")
        ? Number(searchParams.get("availability"))
        : "",
      category: searchParams.get("category") || "",
      sortType: searchParams.get("sortType") || "",
      resultsPerPage: searchParams.get("resultsPerPage")
        ? Number(searchParams.get("resultsPerPage"))
        : 60,
      currentPage: searchParams.get("currentPage")
        ? Number(searchParams.get("currentPage"))
        : 1,
      tags: {},
    },
  });

  const { register, control, setValue, getValues, handleSubmit } = methods; // watch

  // console.log(watch("tags"));

  useEffect(() => {
    const tagsFromUrl = GetTagsFromUrl(searchParams);
    setValue("tags", tagsFromUrl.tags);
  }, [searchParams, setValue]);

  const onSubmit = (data: SearchSchemaType) => {
    const query = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "tags") {
        Object.entries(value).forEach(([tagName, tagAttributes]) => {
          for (const tagAttribute of tagAttributes) {
            if (tagAttribute) {
              query.append(`tags.${tagName}`, tagAttribute);
            }
          }
        });
      } else if (value === "") {
        // console.log(value);
        // console.log(key);
      } else if (value) {
        query.set(key, value as string);
      }
    });

    navigate(`/products?${query.toString()}`);
  };

  const handleClickTag = (
    tagNameToChange: string,
    tagAttributeToChange: string
  ) => {
    const currentTags = getValues("tags");
    // console.log(currentTags);

    if (currentTags) {
      if (currentTags[tagNameToChange]) {
        if (currentTags[tagNameToChange].includes(tagAttributeToChange)) {
          const updatedTagList = currentTags[tagNameToChange].filter(
            (attr) => attr !== tagAttributeToChange
          );
          const updatedTags = {
            ...currentTags,
            [tagNameToChange]: updatedTagList,
          };

          if (updatedTagList.length === 0) {
            delete updatedTags[tagNameToChange];
          }

          setValue("tags", updatedTags, { shouldDirty: true });
        } else {
          const updatedTags = {
            ...currentTags,
            [tagNameToChange]: [
              ...currentTags[tagNameToChange],
              tagAttributeToChange,
            ],
          };
          setValue("tags", updatedTags, { shouldDirty: true });
        }
      } else {
        const updatedTags = {
          ...currentTags,
          [tagNameToChange]: [tagAttributeToChange],
        };
        setValue("tags", updatedTags, { shouldDirty: true });
      }
    }
    // console.log(currentTags);
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="category"
          control={control}
          render={() => <SidebarCategories />}
        />
        <Form.Label>Search:</Form.Label>
        <Form.Control placeholder="search name" {...register("search")} />
        <Form.Label>Price</Form.Label>
        <InputGroup>
          <Row>
            <Col className="f1 relative">
              <Form.Control
                type="number"
                min="0"
                placeholder="Min Price"
                {...register("minPrice")}
              />
            </Col>
            <Col className="f1 relative">
              <Form.Control
                type="number"
                min="0"
                placeholder="Max Price"
                {...register("maxPrice")}
              />
            </Col>
          </Row>
        </InputGroup>
        {/* <Form.Check type="switch" {...register("availability")} /> */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <SidebarTags
              selectedTags={field.value ? field.value : {}}
              tagClick={handleClickTag}
            />
          )}
        />
        <Button type="submit">Search</Button>
      </Form>
    </FormProvider>
  );
};

export default SearchFilters;
