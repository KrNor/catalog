import { Form, InputGroup, Button, Col, Row } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { searchSchema, type SearchSchemaType } from "../validation";

const SearchFilters = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { register, handleSubmit } = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : "",
      maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : "",
      search: params.get("search") || "",
      availability: params.get("availability")
        ? Number(params.get("availability"))
        : "",
      category: params.get("category") || "",
      sortType: params.get("sortType") || "",
      resultsPerPage: params.get("resultsPerPage")
        ? Number(params.get("resultsPerPage"))
        : 60,
      currentPage: params.get("currentPage")
        ? Number(params.get("currentPage"))
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
