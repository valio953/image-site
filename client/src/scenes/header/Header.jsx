import { useNavigate } from "react-router-dom";
import { useState } from "react";
// Bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState();
  const [uploadMessage, setUploadMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    setUploadMessage("");
  };
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    const result = await axios.post("http://localhost:8080/upload-image", formData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (result.status === 200) {
      setUploadMessage(result.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
    setUploadMessage("");
  };

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-center" style={{ flex: 1 }}>
              <Nav.Link
                onClick={() => {
                  navigate("/");
                }}
              >
                Начало
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("images");
                }}
              >
                Снимки
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("users");
                }}
              >
                Потребители
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("contact");
                }}
              >
                Контакти
              </Nav.Link>
              {user?.token && (
                <NavDropdown className="ml-3" title={user?.user?.user_name} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleShow}>Качи снимка</NavDropdown.Item>
                  <NavDropdown.Item>Редактирай профил</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Изход</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Качи снимка</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="img">Избери изображениея:</label>
            <div className="my-2">
              <input
                type="file"
                id="img"
                name="img"
                multiple={false}
                accept="image/*"
                onChange={onInputChange}
              />
            </div>
            <p>{uploadMessage}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Затвори
            </Button>
            <Button variant="primary" type="submit">
              Качи
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default Header;
