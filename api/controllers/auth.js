const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = name.replace(/<\/?[^>]+(>|$)/g, ""); //Remove HTML tags from user input

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    pool.query(
      "INSERT INTO users (user_email, user_password, user_name) VALUES (?, ?, ?)",
      [email, passwordHash, cleanName],
      async (error, result) => {
        if (error) {
          res.status(500).json({ error: "Възникна грешка. Моля опитайте отново по-късно." });
        } else {
          res.status(201).json({
            message: "Потребителят е създаден успешно! Моля впишете се от формата за вход!",
            userId: result.insertId,
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE user_email = ?";
    const values = [email];

    pool.execute(query, values, async (error, results) => {
      if (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Появи се грешка при опита за вписване." });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Потребителят не е намерен." });
      }

      const user = results[0];

      const passwordsMatch = await bcrypt.compare(password, user.user_password);
      if (!passwordsMatch) return res.status(401).json({ message: "Невалидна парола" });

      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
      delete user.user_password;

      res.status(200).json({ token, user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE user_email = ? AND user_is_admin = 1";
    const values = [email];

    pool.execute(query, values, async (error, results) => {
      if (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Появи се грешка при опита за вписване." });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Такъв потребител с администраторски права не е намерен." });
      }

      const user = results[0];

      const passwordsMatch = await bcrypt.compare(password, user.user_password);
      if (!passwordsMatch) return res.status(401).json({ message: "Невалидна парола" });

      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
      const isAdminLogin = true;
      delete user.user_password;

      res.status(200).json({ token, user, isAdminLogin });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
