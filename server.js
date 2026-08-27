const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "DailyDrop Backend is Working!"
    });
});

app.listen(PORT, () => {
    console.log(`DailyDrop Backend running on http://localhost:${PORT}`);
});