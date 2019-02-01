const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Defining a data representation
var subjectDataSchema = new Schema({
    name: { type: String, required: true },
    time: { type: Date, default: Date.now },
    courses: [{
        filename: String,
        author: String,
        duration: Number,
        description: String

    }]
});

// Creating a collection
var subjectData = mongoose.model("Subject", subjectDataSchema);
//console.log(userData);
module.exports = subjectData;