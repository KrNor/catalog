import {
  Form,
  InputGroup,
  Button,
  Col,
  Row,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetCategoryFamilyQuery } from "../reducers/apiReducer";
import { searchSchema, type SearchSchemaType } from "../validation";
import { BaseCategoryHook } from "../hooks";
import type { CategoryToReturn } from "../types";

interface SidebarCategoriesProps {
  onChange: (value: string) => void;
}

export const SidebarCategories = ({ onChange }: SidebarCategoriesProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [curentLineage, setCurentCategoryLineage] = useState<
    Array<CategoryToReturn> | undefined
  >(undefined);

  const categoryy = searchParams.get("category");

  const { baseCatFam, baseCatFamLoading, baseCatFamError } = BaseCategoryHook();

  const {
    data: currentCategoryFamily,
    error,
    isLoading,
  } = useGetCategoryFamilyQuery(categoryy || undefined);

  useEffect(() => {
    if (currentCategoryFamily) {
      setCurentCategoryLineage(
        currentCategoryFamily.lineage.concat(currentCategoryFamily.category)
      );
    } else {
      setCurentCategoryLineage(undefined);
    }
  }, [searchParams, currentCategoryFamily]);

  if (error || baseCatFamError) {
    return (
      <Alert variant="danger">
        error occured when getting categories, try again later.
      </Alert>
    );
  }

  if (isLoading || baseCatFamLoading) {
    return <Spinner animation="border" />;
  }

  const setCurrentCategory = (id: string | null) => {
    if (id !== null) {
      searchParams.set("category", id);
    }
    if (id === "") {
      searchParams.delete("category");
    }
    onChange(id as string);
    navigate(`/products?${searchParams.toString()}`);
  };

  return (
    <ListGroup onSelect={(categg) => setCurrentCategory(categg)}>
      <ListGroup.Item eventKey={""} key={"allcatselect"}>
        All Categories
      </ListGroup.Item>
      {baseCatFam && currentCategoryFamily ? (
        baseCatFam.imediateChildren.map((baseCat) => {
          if (
            curentLineage &&
            curentLineage[0] &&
            baseCat.id === curentLineage[0].id
          ) {
            const temp1 = curentLineage.map((e) => (
              <ListGroup.Item eventKey={e.id} key={e.id + "activ"}>
                {">"}
                {e.name}
              </ListGroup.Item>
            ));

            const temp2 = currentCategoryFamily.imediateChildren.map((e) => (
              <ListGroup.Item eventKey={e.id} key={e.id + "children"}>
                {e.name}
              </ListGroup.Item>
            ));

            return temp1.concat(temp2);
          } else {
            return (
              <ListGroup.Item
                eventKey={baseCat.id}
                key={baseCat.id + "inactive"}
              >
                {baseCat.name}
              </ListGroup.Item>
            );
          }
        })
      ) : (
        <Spinner animation="border" />
      )}
    </ListGroup>
  );
};

const SearchFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { register, control, handleSubmit } = useForm<SearchSchemaType>({
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
    },
  });

  const onSubmit = (data: SearchSchemaType) => {
    const query = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        query.set(key, value as string);
      }
    });

    navigate(`/products?${query.toString()}`);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="category"
        control={control}
        render={({ field }) => <SidebarCategories onChange={field.onChange} />}
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
      {/* <Form.Label>Include only currently availiable</Form.Label> */}
      {/* <Form.Check type="switch" {...register("availability")} /> */}
      <div>adding tag filters here</div>
      <Button type="submit">Search</Button>
    </Form>
  );
};

export default SearchFilters;
