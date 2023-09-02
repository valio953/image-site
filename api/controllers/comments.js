const pool = require("../db");

exports.sendComment = async (req, res) => {
  const { comment_text, comment_to_image } = req.body;
  const userId = req.user.id;

  const clearCommentText = comment_text.replace(/<\/?[^>]+(>|$)/g, ""); //Remove HTML tags from user input

  try {
    // Check the number of existing comments for the image.
    const countQuery = "SELECT COUNT(*) AS commentCount FROM comments WHERE comment_to_image = ?";
    const countValues = [comment_to_image];

    pool.execute(countQuery, countValues, (error, results) => {
      if (error) {
        console.error("Error while saving comment:", error);
        return res.status(500).json({ message: "Грешка при запазването на коментара." });
      }

      const commentCount = results[0].commentCount;

      if (commentCount >= 10) {
        // Reject the comment insertion if the limit is reached.
        return res
          .status(400)
          .json({ message: "Достигнат е максималния брой коментари за това изображение." });
      }

      // If the limit is not reached, proceed to insert the comment.
      const insertQuery =
        "INSERT INTO comments (comment_text, comment_from_user, comment_to_image) VALUES (?, ?, ?)";
      const insertValues = [clearCommentText, userId, comment_to_image];
      pool.execute(insertQuery, insertValues, (insertError, result) => {
        if (insertError) {
          console.error("Error while saving comment:", insertError);
          return res.status(500).json({ message: "An error occurred while saving the comment." });
        }

        // Comment inserted successfully, now retrieve its details
        const insertedCommentId = result.insertId; // Assuming 'comment_id' is an auto-increment primary key

        // Query to fetch the details of the newly inserted comment
        const selectQuery = `
          SELECT * FROM comments 
          INNER JOIN users ON comments.comment_from_user = users.user_id
          WHERE comment_id = ?
        `;
        pool.query(selectQuery, [insertedCommentId], (selectError, commentDetails) => {
          if (selectError) {
            console.error("Error while fetching comment details:", selectError);
            return res
              .status(500)
              .json({ message: "An error occurred while fetching comment details." });
          }

          // Send the inserted comment details as a response to the client
          const newComment = commentDetails[0];
          res.status(200).json({ comment: newComment });
        });
      });
    });
  } catch (err) {
    console.error("Error in send comment:", err);
    res.status(500).json({ message: "Възникна грешка. Моля опитайте отново, по-късно." });
  }
};

exports.getImageComments = async (req, res) => {
  const imageId = req.params.imageId;

  try {
    // Query to select all comments for the specified image.
    const selectQuery = `
      SELECT comments.*, users.user_name
      FROM comments
      INNER JOIN users ON comments.comment_from_user = users.user_id
      WHERE comments.comment_to_image = ?
      ORDER BY comment_date_created DESC
    `;
    const selectValues = [imageId];

    pool.query(selectQuery, selectValues, (error, results) => {
      if (error) {
        console.error("Error while fetching comments:", error);
        return res.status(500).json({ message: "An error occurred while fetching comments." });
      }

      res.json(results);
    });
  } catch (err) {
    console.error("Error in get comments:", err);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
};
