import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom"; // ,NavLink Link

const ActionSelection = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <ListGroup>
        <ListGroup.Item action onClick={() => navigate(`createCategory`)}>
          Create Category
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate(`manageCategories`)}>
          Manage Categories
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate(`createProduct`)}>
          Create Product
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate(`manageProducts`)}>
          Manage Products
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
};

const AdminPanel = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col sm={2}>
            <ActionSelection />
          </Col>
          <Col sm={10}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPanel;
