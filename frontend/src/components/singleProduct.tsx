import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "react-bootstrap";

import { getProduct } from "../reducers/currentProductReducer";
import type { RootState } from "../types";

const SingleProductDetailed = () => {
  const [key, setKey] = useState<string>("inactive");
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(getProduct(id as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const product = useSelector((state: RootState) => {
    return state.currentProduct.product;
  });

  if (product === undefined) {
    return <div>product not found</div>;
  } else {
    console.log(product.tags);
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
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.descriptionShort}</Card.Text>
                <Card.Text>{product.price}</Card.Text>
                <Card.Text>{product.avaliability}</Card.Text>
                <Card.Text>{product.Identifier}</Card.Text>
                <Card.Text>{product.descriptionShort}</Card.Text>
                <Card.Text>{product.descriptionLong}</Card.Text>
                <Card.Text>{product.id}</Card.Text>
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
                          {product.tags.map((tag) => (
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
