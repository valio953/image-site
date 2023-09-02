import FormContact from "components/FormContact/FormContact";

// Boostrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ContactPage = () => {
  return (
    <Container className="py-3">
      <Row>
        <Col>
          <h1>Контакти</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormContact />
        </Col>
        <Col md={6}></Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
