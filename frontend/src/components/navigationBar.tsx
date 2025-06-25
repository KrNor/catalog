import { Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthHook } from "../hooks";

const NavigationBar = () => {
  const padding = {
    padding: 5,
  };

  const { user, isLoading, error, logout } = AuthHook();

  if (isLoading) {
    return <div>loading ...</div>;
  }

  if (error) {
    return <div>error with system, try agian later.</div>;
  }

  return (
    <Navbar>
      <Link style={padding} to="/">
        home
      </Link>
      <Link style={padding} to="/products">
        products
      </Link>
      <Link style={padding} to="/login">
        login pace
      </Link>

      {user ? (
        <>
          <div>hello {user.user.username}</div>
          <Link style={padding} to="/panel">
            admin panel
          </Link>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <div></div>
      )}
      {/* 
      <SearchBurron /> */}
    </Navbar>
  );
};

export default NavigationBar;
