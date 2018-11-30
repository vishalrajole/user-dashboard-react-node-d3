const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
var { authenticate } = require("./middleware/authenticate");

const { mongoose } = require("./db/mongoose");
const _ = require("lodash");
const { Users } = require("./models/user");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); //TODO NOT a good way to open for all. Should have whitelisted origins

app.post("/login", (req, res) => {
    var body = _.pick(req.body, ["username", "password"]);
    if (body.username === "test" && body.password === "password") {
        //mocked for time being. Should be in db with some kind of token based auth
        res.status(200).send({ token: "sdkjne8njsdh2sdksfkj" }); // should be jwt token
    } else {
        res.status(404).send("Invalid login details");
    }
});

app.get('/user', authenticate, (req, res) => {
    var username = req.query.username;
    console.log('username:: ', username)
    Users.findOne({
        username: username
    }).then(user => {
        console.log("inside get user::: ", user)
        if (!user) { res.status(404).send(); }

        res.status(200).send(user);
    }).catch(error => {
        res.status(404).send("Not found");
    })
});

// Pull all users with name
app.get('/users', authenticate, (req, res) => {
    Users.find({}, { username: 1 }).then(users => {
        console.log("inside get user::: ", users)
        if (!users) { res.status(404).send(); };
        res.status(200).send([users]);
    }).catch(error => {
        res.status(404).send("Not found");
    })
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));