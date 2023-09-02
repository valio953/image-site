require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const verifyToken = require("./middleware/auth");
const getUsers = require("./controllers/users");
const imagesController = require("./controllers/images");
const { getImages, uploadImage, getImage, getImageAuthor, deleteImage } = imagesController;
const commentsController = require("./controllers/comments");
const { sendComment, getImageComments } = commentsController;
const submitMessage = require("./controllers/messages");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Absolute path to the uploads directory
const uploadsPath = path.join(__dirname, "uploads");
// Uploads middleware
app.use("/uploads", express.static(uploadsPath));

// Handle Registration
app.use("/auth", authRoutes);

// Handle Admin Routes
app.use("/admin", adminRoutes);

// Users
app.get("/users", getUsers);

// Images
app.get("/images", getImages);

// Image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random());
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), verifyToken, uploadImage);
app.get("/get-image/:image_id", getImage);
app.get("/get-image-author/:image_id", verifyToken, getImageAuthor);
app.delete("/delete-image/:image_id", verifyToken, deleteImage);
// Comments
app.post("/send-comment", verifyToken, sendComment);
app.get("/comments/:imageId", getImageComments);
// Contact messages
app.post("/submit-message", submitMessage);

// Start the server
app.listen(port, () => {
  console.log(`Serverss is running on port ${port}`);
});
