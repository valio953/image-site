const pool = require("../db");
const nodemailer = require("nodemailer");

const submitMessage = async (req, res) => {
  const { name, email, text } = req.body;

  //Remove HTML tags from user input
  const cleanName = name.replace(/<\/?[^>]+(>|$)/g, "");
  const cleanEmail = email.replace(/<\/?[^>]+(>|$)/g, "");
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");

  // Check if the user is registered based on their email
  const getUserQuery = "SELECT user_id FROM users WHERE user_email = ?";
  pool.query(getUserQuery, [cleanEmail], (getUserError, userResults) => {
    if (getUserError) {
      console.error("Error fetching user:", getUserError);
      return res.status(500);
    }

    let isRegistered = 0;
    if (userResults.length > 0) isRegistered = 1;

    // User is registered, proceed to save the message
    const insertMessageQuery =
      "INSERT INTO messages (message_name, message_email, message_text, message_is_user_registered) VALUES (?, ?, ?, ?)";

    pool.query(
      insertMessageQuery,
      [cleanName, cleanEmail, cleanText, isRegistered],
      (insertError, insertResults) => {
        if (insertError) {
          console.error("Error inserting message:", insertError);
          return res.status(500).json({ error: "Появи се грешка при записа на съобщението." });
        }

        // Send email with Nodemailer
        const transporter = nodemailer.createTransport({
          host: "mail@imgsite.example", // Have to configure
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "no-reply@imgsite.example", // Have to configure
            pass: "ImgSitePass", // Have to configure
          },
        });

        const mailText = `
            Име: ${cleanName}
            Имейл:${cleanEmail}
            Съобщение: ${cleanText}
          `;

        const mailOptions = {
          from: "contact-form@imgsite.example",
          to: "system@imgsite.example",
          subject: "Съобщение от контактната форма",
          text: mailText,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              message:
                "Съобщението е записано. За да се изпрати съобщението е нужно да се конфигурира транспортера.",
            });
            console.error(error);
          } else {
            res.json({ message: "Съощението е изпратено успешно!" });
          }
        });
      }
    );
  });
};

module.exports = submitMessage;
