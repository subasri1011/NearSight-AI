const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const analysisRoutes = require("./routes/analysisRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();


// ======================================================
// Middleware
// ======================================================

app.use(cors());
app.use(express.json());


// ======================================================
// Routes
// ======================================================

app.use("/api/analysis", analysisRoutes);
app.use("/api/videos", videoRoutes);


// ======================================================
// Home Route
// ======================================================

app.get("/", (req, res) => {

    res.json({
        message: "NearSight Backend is running!"
    });

});


// ======================================================
// Start Server
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `NearSight Backend running on http://localhost:${PORT}`
    );

});