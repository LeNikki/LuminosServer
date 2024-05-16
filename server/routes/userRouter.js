const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

router.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error!!" });
      return;
    }
    return res.json(results);
  });
});

//POST route to handle adding a new user
router.post("/users", async (req, res) => {
  const newUser = req.body;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return err;
    }

    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        return;
      }
      const sql =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      const values = [newUser.username, newUser.email, hash];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error adding new user:", err);
          res.status(500).send("Error adding new user: ", err);
          return;
        }
        console.log("New user added:", result);
        res.status(201).send("User added successfully");
      });
    });
  });
});
router.get("/dashboard", (req, res) => {
  const welcomeMessage = req.query.message || "Welcome!";
  res.send(`<h1>${welcomeMessage}</h1>`);
});

router.post("/users/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json("No user found");
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err) {
        // console.error("Error retrieving user:", err);
        return res.status(500).json("Error 500");
      }
      const user = rows[0];

      if (user) {
        // return res.json("User Found!");
        bcrypt.compare(password, user.password, function (error, result) {
          if (error) {
            console.error("Error comparing passwords:", error);
            return res
              .status(500)
              .json({ message: "Error comparing passwords" });
          }
          if (result) {
            return res.json({ userLogged: user.username });
          } else {
            return res.json("Password not match");
          }
        });
      }
    }
  );
});

//POST route to handle sign in
// router.post("/users/login", (req, res) => {
//   console.log("Received ", email, password);
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "Missing email or password" });
//   }
//   db.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email],
//     async (err, rows) => {
//       if (err) {
//         console.error("Error retrieving user:", err);
//         return res.status(500).json({ message: "Internal server error!" });
//       }

//       // Log the rows retrieved from the database
//       console.log("Rows from DB:", rows);

//       const user = rows[0];
//       if (user) {
//         console.log("User found:", user);
//         bcrypt.compare(password, user.password, function (error, result) {
//           if (error) {
//             console.error("Error comparing passwords:", error);
//             return res
//               .status(500)
//               .json({ message: "Internal server error!!!" });
//           }
//           console.log("Password comparison result:", result);
//           if (result === true) {
//             return res.status(200).json({ message: "Password matches" });
//           } else {
//             return res.status(401).json({ message: "Incorrect password" });
//           }
//         });
//       } else {
//         console.log("User not found");
//         return res.status(404).json({ message: "User not found" });
//       }
//     }
//   );
// });

module.exports = router;
