const corsOptions = {
    origin: "http://localhost:3000"
}

const express = require("express");
const app = express();
const cors = require("cors");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: corsOptions
});
const socketEvents = require("./src/socket")(io);
const mongoose = require("mongoose");

app.use(cors(corsOptions));

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

mongoose.connect("mongodb://127.0.0.1:27017/google_docs_clone", mongooseOptions, (err) => {
    console.log("MongoDB connected");
    if (err) console.error(err);
});

httpServer.listen(3001);
