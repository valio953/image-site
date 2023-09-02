import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import axios from "axios";

const FormContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setResponse("");
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");

    try {
      const formData = {
        name: name,
        email: email,
        text: message,
      };

      const result = await axios.post("http://localhost:8080/submit-message", formData);
      if (result.status === 200) setResponse(result.data.message);
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Име</Form.Label>
        <Form.Control placeholder="Вашето име" value={name} onChange={handleNameChange} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Вашия email"
          value={email}
          onChange={handleEmailChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Съобщение</Form.Label>
        <Form.Control as="textarea" rows={3} value={message} onChange={handleMessageChange} />
      </Form.Group>
      {response && <Alert variant="info">{response}</Alert>}
      <Button type="submit">Изпрати</Button>
    </Form>
  );
};
export default FormContact;
