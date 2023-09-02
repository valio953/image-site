import { useEffect, useState } from "react";
import axios from "axios";
// Boostrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// Components
import ListUsersAdmin from "components/Admin/ListUsersAdmin/ListUsersAdmin";
import ListImagesAdmin from "components/Admin/ListImagesAdmin/ListImagesAdmin";

const HomePageAdmin = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch users
    axios
      .get("http://localhost:8080/admin/last-users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching last 5 users:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch images
    axios
      .get("http://localhost:8080/admin/last-images", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching last 5 images:", error);
      });
  }, []);

  return (
    <Container>
      <Row>
        <h1>Начало Админ</h1>
      </Row>
      <Row>
        <h3>Потребители</h3>
        <ListUsersAdmin users={users} />
      </Row>
      <Row className="mt-3">
        <h3>Снимки</h3>
        <ListImagesAdmin images={images} />
      </Row>
    </Container>
  );
};

export default HomePageAdmin;
