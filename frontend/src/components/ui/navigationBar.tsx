import {
  Navbar,
  Button,
  Form,
  InputGroup,
  Alert,
  Spinner,
  Container,
  Nav,
  Dropdown,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // useSearchParams
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useBaseCategoryFamily } from "@/hooks/useBaseCategoryFamily";

const NavBarSearch = () => {
  const navigate = useNavigate();
  const [navSearchMessage, setNavSearchMessage] = useState<string>("");

  const navBarSearch = () => {
    const query = new URLSearchParams();

    if (navSearchMessage === "") {
      query.delete("search");
    } else {
      query.set("search", navSearchMessage);
    }
    navigate(`/products?${query.toString()}`);
    window.location.reload();
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
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { user, isLoading, error, logout } = useAuth();
  const { baseCatFam, baseCatFamLoading, baseCatFamError } =
    useBaseCategoryFamily();

  const navigate = useNavigate();

  if (isLoading || baseCatFamLoading) {
    return <Spinner animation="border" />;
  }

  if (error || baseCatFamError) {
    return (
      <Alert variant="danger">
        error occured when getting products, try again later.
      </Alert>
    );
  }

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const setCurrentCategory = (id: string | null) => {
    const query = new URLSearchParams();
    if (id !== null) {
      if (id === "") {
        query.delete("category");
      } else {
        query.set("category", id);
      }
    }
    navigate(`/products?${query.toString()}`);
    // window.location.reload();
  };
  return (
    <Container>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand>
          <Link to="/">Catalog</Link>
        </Navbar.Brand>
        <Nav className="me-auto">
          <NavDropdown
            title="Products"
            onSelect={(categg) => setCurrentCategory(categg)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            show={showDropdown}
          >
            <Dropdown.Item key={"default" + "navbarcat"} eventKey={""}>
              All
            </Dropdown.Item>
            {baseCatFam?.imediateChildren.map((categ) => (
              <Dropdown.Item key={categ.id + "navbarcat"} eventKey={categ.id}>
                {categ.name}
              </Dropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
        {!user ? <Link to="/login">login</Link> : <></>}
        <Nav className="justify-content-end">
          {user ? (
            <>
              <Navbar.Text>hello {user.user.username}</Navbar.Text>
              <Link to="/panel">admin panel</Link>

              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <></>
          )}
          <NavBarSearch />
        </Nav>
      </Navbar>
    </Container>
  );
};

export default NavigationBar;
