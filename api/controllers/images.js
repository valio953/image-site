const path = require("path");
const pool = require("../db");
const fs = require("fs");

exports.getImages = async (req, res) => {
  // Check IF the request has a query string and if it doesn't have return the last 10 images
  // ELSE it returns all images in DESC order based on the upload date and with pagination
  if (Object.keys(req.query).length === 0) {
    pool.query(
      "SELECT * FROM images ORDER BY image_date_created DESC LIMIT 10",
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "An error occurred" });
        } else {
          res.json(results);
        }
      }
    );
  } else {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const imagesQuery = "SELECT * FROM images ORDER BY image_date_created DESC LIMIT ? OFFSET ?";
    const countQuery = "SELECT COUNT(*) AS total FROM images";

    pool.query(imagesQuery, [limit, offset], (error, images) => {
      if (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      pool.query(countQuery, (countError, countResult) => {
        if (countError) {
          console.error("Error fetching image count:", countError);
          res.status(500).json({ error: "An error occurred" });
          return;
        }

        const totalImages = countResult[0].total;
        const totalPages = Math.ceil(totalImages / limit);

        res.json({
          images,
          page,
          totalPages,
        });
      });
    });
  }
};

exports.uploadImage = async (req, res) => {
  const imageOriginalName = req.file.originalname;
  const imageSystemName = req.file.filename;
  const userId = req.user.id;

  try {
    // Insert the image information into your MySQL database.
    const insertQuery =
      "INSERT INTO images (image_name, image_path, image_from_user) VALUES (?, ?, ?)";
    const values = [imageOriginalName, `/${imageSystemName}`, userId];

    pool.execute(insertQuery, values, (error, results) => {
      if (error) {
        console.error("Error while saving image:", error);
        return res.status(500).json({ message: "Възникна грешка при запазване на изображението." });
      }

      res.json({ message: "Снимката е качена успешно!" });
    });
  } catch (err) {
    console.error("Error in upload image:", err);
    res.status(500).json({ err: "Възникна грешка. Моля опитайте отново, по-късно." });
  }
};

exports.getImage = (req, res) => {
  const imageId = req.params.image_id;

  // Query the database to retrieve the image path based on image_id
  const selectQuery = "SELECT image_path, image_from_user FROM images WHERE image_id = ?";
  pool.query(selectQuery, [imageId], (error, results) => {
    if (error) {
      console.error("Error fetching image:", error);
      return res.status(500).json({ error: "An error occurred while fetching the image." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Image not found." });
    }

    const imagePath = results[0].image_path;
    const authorId = results[0].image_from_user;
    const fullImagePath = path.join(__dirname, "..", "uploads", imagePath);

    // Send the image as a response
    res.sendFile(fullImagePath);
  });
};

exports.getImageAuthor = async (req, res) => {
  const imageId = req.params.image_id;

  // Query the database to retrieve the image author based on image_id
  const selectQuery = "SELECT image_from_user FROM images WHERE image_id = ?";
  pool.query(selectQuery, [imageId], (error, results) => {
    if (error) {
      console.error("Error fetching image author:", error);
      return res
        .status(500)
        .json({ error: "Появи се грешки при опита да се вземе автора на изображението." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Изображението не е открито." });
    }

    const authorId = results[0].image_from_user;

    // Send the authorId as a response
    res.status(200).json({ authorId });
  });
};

exports.deleteImage = async (req, res) => {
  const { image_id } = req.params;
  const userId = req.user.id;

  // Check if the user is the author of the image
  const checkOwnershipQuery = "SELECT image_from_user, image_path FROM images WHERE image_id = ?";
  pool.query(checkOwnershipQuery, [image_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error checking image ownership" });
    }

    const image = results[0];

    if (!image || image.image_from_user !== userId) {
      return res.status(403).json({ message: "Нямате права да изтриете това изображение!" });
    }

    // Delete the comments associated with the image
    const deleteCommentsQuery = "DELETE FROM comments WHERE comment_to_image = ?";
    pool.query(deleteCommentsQuery, [image_id], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error deleting comments associated with the image." });
      }

      // Delete the image file from the server
      fs.unlink(`./uploads${image.image_path}`, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting image file" });
        }

        // Delete the image record from the database
        const deleteImageQuery = "DELETE FROM images WHERE image_id = ?";
        pool.query(deleteImageQuery, [image_id], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Грешка при премахването на изображението от базата данни." });
          }

          res.status(200).json({ message: "Изображението е изтрито успешно!" });
        });
      });
    });
  });
};
