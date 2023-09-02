import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "components/Comments/Comments";
// Bootstrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import { Button } from "react-bootstrap";

const ImagePage = ({ user }) => {
  const [authorId, setAuthorId] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const { imageId } = useParams();
  const imageUrl = `http://localhost:8080/get-image/${imageId}`;

  useEffect(() => {
    // Fetch the authorId for the image
    const fetchAuthorId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get-image-author/${imageId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 200) {
          const fetchedAuthorId = response.data.authorId;
          setAuthorId(fetchedAuthorId);

          // Check if the authorId matches the user's ID
          setIsAuthor(fetchedAuthorId === user.user.user_id);
        }
      } catch (error) {
        console.error("Възникна грешка при взимането на автора на изображението:", error);
      }
    };

    if (user?.token) fetchAuthorId();
  }, [user?.token, imageId]);

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/delete-image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 200) {
        // Optionally, update the UI to reflect the image's removal
        window.location.href = "/images";
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <Container className="py-3">
      <Row>
        <Col xs={3} md={3}></Col>
        <Col xs={6} md={6}>
          <Image src={imageUrl} fluid />
          <Row className="mt-3">
            <h3>Коментари</h3>
          </Row>
          <Row>
            <Comments user={user} image={imageId} />
          </Row>
        </Col>
        <Col xs={3} md={3}>
          {isAuthor && (
            <Alert variant="warning">
              <p>Изтрии изображението</p>
              <Button variant="danger" onClick={handleDeleteImage}>
                Изтрии
              </Button>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ImagePage;
