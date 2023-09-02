// Bootstrap
import Card from "react-bootstrap/Card";
import FormComment from "components/FormComment/FormComment";
import { useEffect, useState } from "react";
import axios from "axios";

const Comments = ({ user, image }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Make an API request to fetch comments for the specified image.
    axios
      .get(`http://localhost:8080/comments/${image}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [image]);

  const addComment = (newComment) => {
    // Add the new comment to the beginning of the comments array
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  return (
    <>
      {user?.token && <FormComment user={user} image={image} addComment={addComment} />}

      {comments.map((comment) => (
        <Card className="px-0 mb-1" key={comment.comment_id}>
          <Card.Header>{comment.user_name}</Card.Header>
          <Card.Body>
            <Card.Text>{comment.comment_text}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};
export default Comments;
