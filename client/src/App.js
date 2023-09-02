import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "scenes/header/Header";
import HomePage from "scenes/homePage/HomePage";
import ImagesPage from "scenes/imagesPage/ImagesPage";
import ImagePage from "scenes/imagePage/ImagePage";
import UsersPage from "scenes/usersPage/UsersPage";
import ContactPage from "scenes/contactPage/ContactPage";
import HeaderAdmin from "scenes/Admin/headerAdmin/HeaderAdmin";
import HomePageAdmin from "scenes/Admin/HomeAdmin/HomeAdmin";

function App() {
  const initialUser = localStorage.getItem("user");
  const parsedUser = initialUser && initialUser !== "undefined" ? JSON.parse(initialUser) : null;
  const [user, setUser] = useState(parsedUser);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/images")
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        {user?.token && user?.user.user_is_admin === 1 && user?.isAdminLogin ? (
          <HeaderAdmin user={user} />
        ) : (
          <Header user={user} />
        )}
        <Routes>
          {user?.token && user?.user.user_is_admin === 1 && user?.isAdminLogin ? (
            <Route path="/" element={<HomePageAdmin user={user} images={images} />} />
          ) : (
            <>
              <Route path="/" element={<HomePage user={user} images={images} />} />
              <Route path="/images" element={<ImagesPage />} />
              <Route path="/image/:imageId" element={<ImagePage user={user} />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
