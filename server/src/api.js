const express = require("express");
const router = express.Router();
const passport = require("passport");
const Document = require("./models/Document");
const mongoose = require("mongoose");

router.post("/login", passport.authenticate("local"), function (req, res) {
    res.send({ success: true, user: req.user });
});

router.get("/user", checkLoggedIn, async function (req, res) {
    res.send({ user: req.user });
});

router.get("/documents/me", checkLoggedIn, async function (req, res) {
    const documents = await Document.find({
        userId: new mongoose.Types.ObjectId(req.user._id),
    });

    res.json(documents);
});

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.send("User not authenticated").status(401);
    }
}

module.exports = router;
