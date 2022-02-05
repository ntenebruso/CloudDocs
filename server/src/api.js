const express = require("express");
const router = express.Router();
const passport = require("passport");
const Document = require("./models/Document");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
    res.send("Test");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        let success;
        if (err) throw err;
        if (!user) success = false;
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                success = true;
            })
        }
        res.send({ success, user });
    })(req, res, next);
});

router.get("/user", checkLoggedIn, async (req, res) => {
    res.send({ user: req.user, loggedIn: true });
});

router.get("/user-documents", checkLoggedIn, async (req, res) => {
    const documents = await Document.find({ userId: mongoose.Types.ObjectId(req.user._id) }).exec();
    res.json(documents);
});

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.send({ loggedIn: false });
    }
}

module.exports = router;