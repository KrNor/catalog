import {
  Navbar,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { AuthHook } from "../hooks";

const NavBarSearch = () => {
  const navigate = useNavigate();
  const [navSearchMessage, setNavSearchMessage] = useState<string>("");

  const navBarSearch = () => {
    const query = new URLSearchParams();
    query.set("search", navSearchMessage as string);
    navigate(`/products?${query.toString()}`);
  };
  return (
    <Form action={navBarSearch}>
      <InputGroup className="mb-3">
        <Form.Control
          name="NavbarSearch"
          type="input"
          placeholder="Search"
          aria-label="Navigation bar search field"
          aria-describedby="search-button"
          value={navSearchMessage}
          onChange={(e) => setNavSearchMessage(e.target.value)}
        />
        <Button type="submit" variant="outline-secondary" id="search-button">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

const NavigationBar = () => {
  const padding = {
    padding: 5,
  };

  const { user, isLoading, error, logout } = AuthHook();

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        error occured when getting products, try again later.
      </Alert>
    );
  }

  return (
    <Navbar>
      <Link style={padding} to="/">
        home
      </Link>
      <Link style={padding} to="/products">
        products
      </Link>
      {!user ? (
        <Link style={padding} to="/login">
          login
        </Link>
      ) : (
        <></>
      )}
      {user ? (
        <>
          <div>hello {user.user.username}</div>
          <Link style={padding} to="/panel">
            admin panel
          </Link>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <></>
      )}
      <NavBarSearch />
    </Navbar>
  );
};

export default NavigationBar;
