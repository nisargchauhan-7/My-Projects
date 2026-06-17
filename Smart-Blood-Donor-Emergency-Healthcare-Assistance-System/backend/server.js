const express = require("express");
const cors = require("cors");
const db = require("./db");

const userRoutes =
require("./routes/users");

const donorRoutes =
require("./routes/donors");

const requestRoutes =
require("./routes/requests");

const hospitalRoutes =
require("./routes/hospitals");

const messageRoutes =
require("./routes/message");

const adminRoutes =
require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/donors", donorRoutes);

app.use("/api/requests", requestRoutes);

app.use("/api/hospitals", hospitalRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("SBDEHAS Backend Running");
});

app.listen(8000, () => {
    console.log("Server Running On Port 8000");
});
