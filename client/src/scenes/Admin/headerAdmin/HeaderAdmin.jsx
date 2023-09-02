import { useNavigate } from "react-router-dom";
import { useState } from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const HeaderAdmin = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
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
            {user?.token && (
              <NavDropdown className="ml-3" title={user?.user?.user_name} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Изход</NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link eventKey="disabled" disabled>
              Администратор
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderAdmin;
