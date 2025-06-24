import { Form, InputGroup, Button, Col, Row } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { searchSchema, type SearchSchema } from "../validation";
import { zodResolver } from "@hookform/resolvers/zod";

const SearchFilters = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const validSortTypes = [
    "",
    "newest",
    "oldest",
    "priceAsc",
    "priceDesc",
    "nameAZ",
    "nameZA",
  ] as const;

  const sortTypeFromParams = params.get("sortType");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortType = validSortTypes.includes(sortTypeFromParams as any)
    ? (sortTypeFromParams as (typeof validSortTypes)[number])
    : "";

  const { register, handleSubmit } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : "",
      maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : "",
      search: params.get("search") || "",
      availability: params.get("availability")
        ? Number(params.get("availability"))
        : "",
      category: params.get("category") || "",
      sortType,
      resultsPerPage: params.get("resultsPerPage")
        ? Number(params.get("resultsPerPage"))
        : 60,
      currentPage: params.get("currentPage")
        ? Number(params.get("currentPage"))
        : 1,
    },
  });

  const onSubmit = (data: SearchSchema) => {
    const query = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      // if (key === "availability") {
      //   console.log(typeof value);
      //   console.log(value);
      // }
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
              placeholder="Min Price"
              {...register("minPrice")}
            />
          </Col>
          <Col className="f1 relative">
            <Form.Control
              type="number"
              placeholder="Max Price"
              {...register("maxPrice")}
            />
          </Col>
        </Row>
      </InputGroup>
      <Form.Label>Include only currently availiable</Form.Label>
      <Form.Check type="switch" {...register("availability")} />
      <Form.Select {...register("sortType")}>
        <option value="">Sort by:</option>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priceAsc">Increasing Price </option>
        <option value="priceDesc">Decreasing Price</option>
        <option value="nameAZ">A to Z</option>
        <option value="nameZA">Z to A</option>
      </Form.Select>
      <Button type="submit">Search</Button>
    </Form>
  );
};

export default SearchFilters;
