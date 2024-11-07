
const express = require("express");
const cors = require("cors");
const app = express();

// const jwt = require("jsonwebtoken");

const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

app.listen(PORT,
    console.log(`Server is running on port ${PORT}`)
);


app.get("/", (req, res) => {
    res.json({ message: 'Hello from the Node.js backend!'});
});

// app.post("/login", (req, res) => {
//     // Assuming successful authentication
//     const user = { id: 12345, isAdmin: true };
//     const token = jwt.sign(user, "your-secret-key", { expiresIn: "1h" });
//     res.json({ token });
// });