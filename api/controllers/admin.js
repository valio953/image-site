const pool = require("../db");

// Get the last 5 users based on registratrion date
exports.getLastUsers = async (req, res) => {
  const query = "SELECT * FROM users ORDER BY user_date_created DESC LIMIT 5";

  pool.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: "An error occurred" });
    }

    const usersWithoutPasswords = results.map((user) => {
      const userCopy = { ...user };
      delete userCopy.user_password;
      return userCopy;
    });

    res.status(200).json(usersWithoutPasswords);
  });
};

// Get the last 5 images and the users who have uploaded them
exports.getLastImages = async (req, res) => {
  const query = `
    SELECT i.image_id, i.image_name, i.image_path, i.image_date_created, u.user_name
    FROM images i
    INNER JOIN users u ON i.image_from_user = u.user_id
    ORDER BY i.image_date_created DESC
    LIMIT 5;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching last 5 images:", err);
      return res.status(500).json({ message: "An error occurred while fetching images." });
    }

    res.status(200).json(results);
  });
};
