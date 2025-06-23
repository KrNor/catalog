// import { InputGroup, Form, Button, Navbar } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";

import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

// import { setFilteredProducts } from "../reducers/productReducer";
// import { setQuery } from "../reducers/searchQueryReducer";
// import { logoutUserThunk } from "../reducers/userReducer";
// import type { RootState } from "../types";

// const SearchBurron = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const navBarSearch = (formData: any) => {
//     const query = formData.get("searchThing");

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     dispatch<any>(setQuery(query));

//     const searchQuer = { search: query };

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     dispatch<any>(setFilteredProducts(searchQuer));

//     navigate(`/products?search=${query}`);
//   };

//   return (
//     <Form action={navBarSearch}>
//       <InputGroup className="mb-3">
//         <Form.Control
//           name="searchThing"
//           type="input"
//           placeholder="Search"
//           aria-label="Recipient's username"
//           aria-describedby="basic-addon2"
//         />
//         <Button type="submit" variant="outline-secondary" id="button-addon2">
//           Search
//         </Button>
//       </InputGroup>
//     </Form>
//   );
// };

const NavigationBar = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const padding = {
    padding: 5,
  };

  // const userData = useSelector((state: RootState) => {
  //   return state.user;
  // });

  // const LogOut = () => {
  //   setTimeout(async () => {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     await dispatch<any>(logoutUserThunk());
  //   }, 100);

  //   navigate("/");
  // };

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

      {/* {userData.username.length > 2 ? (
        <div>
          <div>hello {userData.username}</div>
          <Link style={padding} to="/panel">
            admin panel
          </Link>
          <Button onClick={LogOut}>Logout</Button>
        </div>
      ) : (
        <div></div>
      )} */}
      {/* 
      <SearchBurron /> */}
    </Navbar>
  );
};

export default NavigationBar;
