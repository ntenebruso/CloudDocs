const express = require("express");
const passport = require("passport");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

// Server setup
const app = express();
const httpServer = require("http").createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "http://localhost:3000" },
});
require("./src/socket")(io);
require("./src/passportConfig")(passport);

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "test",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/google_docs_clone").then(() => {
    console.log("MongoDB Connected");
});

// Router
const apiRouter = require("./src/api");
app.use("/api", apiRouter);

// Put server online
httpServer.listen(3001);
