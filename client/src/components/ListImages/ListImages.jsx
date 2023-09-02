import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

const ListImages = ({ images }) => {
  return (
    <ListGroup>
      {images.map((image) => (
        <Link to={`/image/${image.image_id}`} key={image.image_id}>
          <ListGroup.Item action>{image.image_name}</ListGroup.Item>
        </Link>
      ))}
    </ListGroup>
  );
};
export default ListImages;
