import React, { useState, useEffect } from "react";
import axios from "axios";
// Bootstrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
// Components
import ListImages from "components/ListImages/ListImages";

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/images?page=${page}&limit=10`)
      .then((response) => {
        setImages(response.data.images);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
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
          <h1>Снимки</h1>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <ListImages images={images} />
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

export default ImagesPage;
