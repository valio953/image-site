// Boostrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// Components
import FormRegister from "components/FormRegister/FormRegister";
import ImgList from "components/ListImages/ListImages";
import FormLogin from "components/FormLogin/FormLogin";
import FormLoginAdmin from "components/Admin/FormLoginAdmin/FormLoginAdmin";

const HomePage = ({ user, images }) => {
  return (
    <Container className="py-3">
      <Row className="mb-5">
        <Col>
          <h1>Начало</h1>
          <h2>Последните снимки</h2>
          <ImgList images={images} />
        </Col>
      </Row>
      {!user && (
        <Row className="mb-5">
          <Col>
            <h2>Регистрация</h2>
            <FormRegister />
          </Col>
        </Row>
      )}
      {!user && (
        <Row>
          <Col>
            <h2>Вход</h2>
            <Tabs defaultActiveKey="user" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="user" title="Потребител">
                <h4>Вход като потребител</h4>
                <FormLogin />
              </Tab>
              <Tab eventKey="admin" title="Админ">
                <h4>Вход като администратор</h4>
                <FormLoginAdmin />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
