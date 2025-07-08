import { Row, Container, Spinner, Alert, Button } from "react-bootstrap";

import { useGetProductsQuery } from "../../reducers/apiReducer";

const ManageProducts = () => {
  // const [searchParams] = useSearchParams();
  // const queryString = searchParams.toString();

  const { data, error, isLoading } = useGetProductsQuery("");

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

  const handleEditClick = () => {};
  const handleDelete = () => {};
  return (
    <Container>
      {data?.map((product) => (
        <Row className="mx-auto p-2 border border-primary">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1" key={product.id}>
              {product.name}
            </div>
            <div className="d-flex">
              <Button
                className="me-2"
                variant="primary"
                size="sm"
                onClick={() => handleEditClick()}
              >
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete()}>
                Delete
              </Button>
            </div>
          </div>
        </Row>
      ))}
    </Container>
  );
};

export default ManageProducts;
