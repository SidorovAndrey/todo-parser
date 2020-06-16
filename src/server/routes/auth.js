const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err)
            return res.status(400).json({ errors: err });

        if (!user)
            return res.status(400).json({ errors: "No user found" });

        req.logIn(user, (err) => {
            if (err)
                return res.status(400).json({ errors: err });

            return res.status(200);
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

router.post("/create", async (req, res, next) => {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ login: req.body.login, password: hash });
    await user.save();
    req.logIn(user, (err) => {
        if (err)
            return res.status(400).json({ errors: err });

        return res.status(200);
    });
    res.redirect("/");
});

module.exports = router;