
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: 'Hello from the Node.js backend!'});
});

app.listen(PORT,
    console.log(`Server is running on port ${PORT}`)
);