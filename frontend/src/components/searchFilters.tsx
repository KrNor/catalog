import { Form, InputGroup, Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilteredProducts } from "../reducers/productReducer";

const allowedFields = [
  "minPrice",
  "maxPrice",
  "search",
  "avaliability",
  "category",
];

const SearchFilters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchBarSearch = (formData: any) => {
    const queryOfSearch: Record<string, string> = {};
    const helperArray = [];
    console.log(formData.entries());

    // too much ifs
    for (const pair of formData.entries()) {
      if (allowedFields.includes(pair[0]) && !(pair[1] === "")) {
        console.log(typeof pair[1]);
        if (typeof pair[0] === "string" && typeof pair[1] === "string") {
          if (pair[0] === "avaliability") {
            queryOfSearch[pair[0]] = "1";
            helperArray.push([pair[0], "1"]);
          } else {
            queryOfSearch[pair[0]] = pair[1];
            helperArray.push([pair[0], pair[1]]);
          }
        }
      }
    }

    console.log("new search query: " + JSON.stringify(queryOfSearch));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(setFilteredProducts(queryOfSearch));

    let navigateString = ``;
    helperArray.forEach((quer) => {
      navigateString += `${quer[0]}=${quer[1]}&`;
    });

    console.log(navigateString);
    navigate(`/products?${navigateString}`);
  };
  return (
    <Form action={searchBarSearch}>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Search:</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            name="search"
            type="input"
            placeholder="Search"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <Button type="submit" variant="outline-secondary" id="button-addon2">
            Search
          </Button>
        </InputGroup>
        <Form.Label>Avaliability</Form.Label>
        <Form.Check
          type="switch"
          name="avaliability"
          label="show only currently avaliable"
        />
        <Form.Label>Price</Form.Label>
        <InputGroup className="mb-3">
          <Row>
            <Col className="f1 relative">
              <Form.Control name="minPrice" type="text" placeholder="Min" />
            </Col>
            <Col className="f1 relative">
              <Form.Control name="maxPrice" type="text" placeholder="Max" />
            </Col>
          </Row>
        </InputGroup>
        <Button type="submit" variant="outline-secondary" id="button-addon2">
          Search
        </Button>
      </Form.Group>
    </Form>
  );
};

export default SearchFilters;
