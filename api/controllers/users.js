const pool = require("../db");

// Get all users in DESC order based on the number of uploaded images per each user with pagination
const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const usersQuery = `
      SELECT u.*, COUNT(i.image_from_user) AS uploaded_images
      FROM users u
      LEFT JOIN images i ON u.user_id = i.image_from_user
      GROUP BY u.user_id
      ORDER BY uploaded_images DESC
      LIMIT ? OFFSET ?
    `;
  const countQuery = "SELECT COUNT(*) AS total FROM users";

  pool.query(usersQuery, [limit, offset], (usersError, users) => {
    if (usersError) {
      console.error("Error fetching users:", usersError);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    pool.query(countQuery, (countError, countResult) => {
      if (countError) {
        console.error("Error fetching user count:", countError);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      const totalUsers = countResult[0].total;
      const totalPages = Math.ceil(totalUsers / limit);

      res.json({
        users: users.map((user) => ({
          ...user,
          uploaded_images_count: user.uploaded_images_count,
        })),
        page,
        totalPages,
      });
    });
  });
};

module.exports = getUsers;
