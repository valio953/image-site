import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";

// Bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const FormLogin = () => {
  const navigate = useNavigate();

  const login = async (values, onSubmitProps) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", values);

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.reload();
      } else {
        // Registration failed, handle error
        console.error(response.data.error); // You can show this error in your UI
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
          <Button variant="primary" type="submit">
            Вход
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormLogin;
