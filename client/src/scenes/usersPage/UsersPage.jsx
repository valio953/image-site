import React, { useState, useEffect } from "react";
import axios from "axios";
// Boostrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
// Components
import ListUsers from "components/ListUsers/ListUsers";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users?page=${page}&limit=10`)
      .then((response) => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container className="py-3">
      <Row>
        <Col>
          <h1>Потребители</h1>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <ListUsers users={users} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => handlePageChange(page - 1)}>Предишна</Button>
          <span className="mx-2">
            Страница {page} от {totalPages}
          </span>
          <Button onClick={() => handlePageChange(page + 1)}>Следваща</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UsersPage;
