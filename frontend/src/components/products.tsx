import { Container, Row, Card, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetAllProductsQuery } from "../reducers/apiReducer";

import SearchFilters from "./searchFilters";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleProduct = (props: any) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/products/${props.product.id}`)}
      style={{ width: "32rem", cursor: "pointer" }}
    >
      <Card.Img variant="top" src="src/images/holderSmall.jpg" />
      <Card.Body>
        <Card.Title>{props.product.name}</Card.Title>
        <Card.Text>{props.product.descriptionShort}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Products = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>error occured when getting products, try again later.</div>;
  }

  if (data) {
    return (
      <Container>
        <Row>
          <Col sm={2}>
            <SearchFilters />
          </Col>
          <Col sm={10}>
            <Container>
              <Row>
                {data.map((product) => (
                  <Col
                    key={product.id}
                    xs={12} // 1 product per row on extra small screens
                    sm={6} // 2 products per row on small screens
                    md={4} // 3 products per row on medium screens
                    lg={3} // 4 products per row on large screens
                    xl={2} // 6 products per row on extra large screens
                    className="mb-4 d-flex"
                  >
                    <SingleProduct key={product.id} product={product} />
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }

  // const allowedKeys: (keyof QueryObject)[] = [
  //   "minPrice",
  //   "maxPrice",
  //   "search",
  //   "avaliability",
  //   "category",
  // ];

  // const queryThing = allowedKeys.reduce((acc, key) => {
  //   const value = searchParams.get(key);
  //   if (value !== null) {
  //     acc[key] = value;
  //   }
  //   return acc;
  // }, {} as QueryObject);

  // console.log("this query thing: " + JSON.stringify(queryThing))
};

// const Products = () => {
//   const [searchParams] = useSearchParams();

//   const allowedKeys: (keyof QueryObject)[] = [
//     "minPrice",
//     "maxPrice",
//     "search",
//     "avaliability",
//     "category",
//   ];

//   const queryThing = allowedKeys.reduce((acc, key) => {
//     const value = searchParams.get(key);
//     if (value !== null) {
//       acc[key] = value;
//     }
//     return acc;
//   }, {} as QueryObject);

//   // console.log("this query thing: " + JSON.stringify(queryThing));

//   return (
//     <Container>
//       <Row>
//         <Col sm={2}>
//           <SearchFilters />
//         </Col>
//         <Col sm={10}>
//           {_.isEmpty(queryThing) ? (
//             <ProductsFirstLoad />
//           ) : (
//             <ProductsNotFirstLoad currQuer={queryThing} />
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

export default Products;
