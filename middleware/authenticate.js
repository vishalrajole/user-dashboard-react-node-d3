const { Users } = require("./../models/user");

var authenticate = (req, res, next) => {
    var token = req.header("Authorization");
    var username = req.query.username;
    console.log("inside middleware: ", token)
    Users.find({ username: username }).then(user => {
        console.log("inside find token: ", user)
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch(error => {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
};
