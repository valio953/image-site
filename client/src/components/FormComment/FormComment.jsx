import { useState } from "react";
import axios from "axios";
// Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const FormComment = ({ user, image, addComment }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      comment_text: comment,
      comment_to_image: image,
    };

    const result = await axios.post("http://localhost:8080/send-comment", data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (result.status === 200) {
      // console.log(result);
      setComment("");
      addComment(result.data.comment); // Add the new comment to the comments list
    }
  };

  return (
    <form className="mb-3 mt-2 p-0" onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          placeholder="Вашия коментар"
          aria-label="comment"
          aria-describedby="basic-addon2"
          value={comment}
          onChange={handleCommentChange}
        />
        <Button variant="outline-secondary" id="button-addon2" type="submit">
          Изпрати
        </Button>
      </InputGroup>
    </form>
  );
};

export default FormComment;
