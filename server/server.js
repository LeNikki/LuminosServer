const express = require("express");
const app = express();
const cors = require("cors");
const usersRouter = require("./routes/userRouter");
app.use(cors());
/**this part parses the request into JSON */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", usersRouter);
//error cannot send
// app.get("/users", (req, res) => {
//   const sql = "SELECT * FROM users";
//   db.query(sql, (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });
// // POST route to handle adding a new user
// app.post("/users", (req, res) => {
//   const newUser = req.body;
//   const sql =
//     "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
//   const values = [
//     newUser.userName,
//     newUser.email,
//     newUser.phone,
//     newUser.password,
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Error adding new user:", err);
//       res.status(500).send("Error adding new user: ", err);
//       return;
//     }
//     console.log("New user added:", result);
//     res.status(201).send("User added successfully");
//   });
// });

app.listen(5000, () => {
  console.log("Server Started at port 5000");
});
