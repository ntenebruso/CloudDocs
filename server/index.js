const express = require("express");
const app = express();
const cors = require("cors");
const httpServer = require("http").createServer(app);
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

const corsOptions = { origin: "http://localhost:3000" };

const io = require("socket.io")(httpServer, {
    cors: corsOptions
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./src/socket")(io);

app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
require("./src/passportConfig")(passport);

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

mongoose.connect("mongodb://127.0.0.1:27017/google_docs_clone", mongooseOptions, (err) => {
    console.log("MongoDB connected");
    if (err) throw err;
});

const apiRouter = require("./src/api");
app.use("/api", apiRouter);

httpServer.listen(3001);
