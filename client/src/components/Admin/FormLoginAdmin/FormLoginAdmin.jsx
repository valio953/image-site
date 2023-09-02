import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

// Bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const FormLoginAdmin = () => {
  const [responseError, setResponseError] = useState("");

  const login = async (values, onSubmitProps) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/admin/login", values);

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.reload();
      } else {
        // Registration failed, handle error
        console.log(response.data.error);
        setResponseError(response.data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseError(error.response.data.message);
      // console.log(responseError);
    }
    onSubmitProps.resetForm();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await login(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
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
          {responseError && <Alert variant="danger">{responseError}</Alert>}
          <Button variant="primary" type="submit">
            Вход
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormLoginAdmin;
