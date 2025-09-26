import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <Container>
      <footer className="py-5">
        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>&copy; 2025 Catalog, Inc. All rights reserved.</p>
          <ul className="list-unstyled d-flex"></ul>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
