const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const chatsRoutes = require("./routes/chats");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Routes chats.js use karvanu key chhe
app.use("/chats", chatsRoutes);

// Server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});

app.use("/", (req, res) => {
    res.redirect("/chats");
});






