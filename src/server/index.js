const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const passport = require("./passportSetup");
const auth = require("./routes/auth");

mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true }, () => console.log("connected to mongo"));

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "this is soooo secret",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth);
app.get("/", (req, res) => res.send("Hello"));

const port = 3000;
app.listen(port, () => console.log(`TODO Parser server started at port ${port}`));