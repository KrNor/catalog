import { InputGroup, Form, Button, Navbar } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setFilteredProducts } from "../reducers/productReducer";
import { setQuery } from "../reducers/searchQueryReducer";

const SearchBurron = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navBarSearch = (formData: any) => {
    const query = formData.get("searchThing");

    // console.log("query inside search button: " + query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(setQuery(query));

    const searchQuer = { search: query };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(setFilteredProducts(searchQuer));

    navigate(`/products?search=${query}`);
  };

  return (
    <Form action={navBarSearch}>
      <InputGroup className="mb-3">
        <Form.Control
          name="searchThing"
          type="input"
          placeholder="Search"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <Button type="submit" variant="outline-secondary" id="button-addon2">
          Button
        </Button>
      </InputGroup>
    </Form>
  );
};

const NavigationBar = () => {
  const padding = {
    padding: 5,
  };

  return (
    <Navbar>
      <Link style={padding} to="/">
        home
      </Link>
      <Link style={padding} to="/products">
        products
      </Link>
      <SearchBurron />
    </Navbar>
  );
};

export default NavigationBar;
