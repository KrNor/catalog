import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Card,
  Col,
  Image,
  Table,
  Tab,
  Nav,
  Alert,
  Spinner,
} from "react-bootstrap";

import { useGetFullProductQuery } from "../../redux/apiReducer";

const SingleProductDetailed = () => {
  const [key, setKey] = useState<string>("inactive");
  const { id } = useParams();
  let productId = "";
  if (!(id === undefined)) {
    productId = id;
  }
  const { data, error, isLoading } = useGetFullProductQuery(productId);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    <Alert variant="danger">
      error occured when getting product, try again later.
    </Alert>;
  }

  if (data) {
    return (
      <Container className="py-4">
        <Row className="align-items-center">
          <Col xs={12} md={7} className="mb-4 mb-md-0 text-center">
            <Image
              src="/src/images/holderBig.jpg"
              alt={"image should be here"}
              fluid
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Col>

          <Col xs={12} md={5}>
            <Card>
              <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Text>{data.descriptionShort}</Card.Text>
                <Card.Text>{data.price}</Card.Text>
                <Card.Text>{data.availability}</Card.Text>
                <Card.Text>{data.identifier}</Card.Text>
                <Card.Text>{data.descriptionShort}</Card.Text>
                <Card.Text>{data.descriptionLong}</Card.Text>
                <Card.Text>{data.id}</Card.Text>
              </Card.Body>
              <Tab.Container
                id="tag-table-tag"
                defaultActiveKey="inactive"
                activeKey={key}
                onSelect={() =>
                  key === "inactive" ? setKey("showing") : setKey("inactive")
                }
              >
                <Tab.Content>
                  <Col>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="showing">show tags</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Pane eventKey="showing">
                      <Table>
                        <tbody>
                          {data.tags.map((tag) => (
                            <tr key={tag.tagName}>
                              <td>{tag.tagName}</td>
                              <td>{tag.tagAttribute}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Col>
                </Tab.Content>
              </Tab.Container>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default SingleProductDetailed;
