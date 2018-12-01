var mongoose = require("mongoose");

const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdashboard';

mongoose.Promise = global.Promise;
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to Database");
}).catch(err => {
    console.log("Not Connected to Database ERROR! ", err);
});

module.exports = { mongoose };
