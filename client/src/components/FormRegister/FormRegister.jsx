import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import "./FormRegister.css";

// Bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const registerSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const initialValuesRegister = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const FormRegister = () => {
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const register = async (values, onSubmitProps) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/register", values);

      if (response.status === 201) {
        // navigate("/");
        setResponse(response.data.message);
      } else {
        // Registration failed, handle error
        console.error(response.data.error);
        setResponse(response.data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    onSubmitProps.resetForm();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);

    setTimeout(() => {
      setResponse("");
    }, 3000);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Име</Form.Label>
            <Form.Control
              placeholder="Въведете вашето име"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              isValid={touched.name && !errors.name}
              isInvalid={!!errors.name}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="Въведете вашия имейл"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              isValid={touched.email && !errors.email}
              isInvalid={!!errors.email}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Парола</Form.Label>
            <Form.Control
              type="password"
              placeholder="Въведете вашата парола"
              name="password"
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
              isInvalid={!!errors.password}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Повторете паролата</Form.Label>
            <Form.Control
              type="password"
              placeholder="Повторете вашата парола"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              isValid={touched.confirmPassword && !errors.confirmPassword}
              isInvalid={!!errors.confirmPassword}
            />
          </Form.Group>
          {response && <Alert type="info">{response}</Alert>}
          <Button variant="primary" type="submit">
            Регистрация
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormRegister;
