var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const subjectsData = require('../models/subject');
// const videosPath = path.join(__dirname, '../videos');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	let resultObj = {};
    subjectsData.find( (err, doc)=>{
        if (err) res.status(404).send('Error Encountered');
        else if (doc) {
            
            // docj = JSON.stringify(doc);
            resultObj = doc;
        }
    })
    .then(() => {
        
	    res.render('listcourses', { 
            title: 'List of Courses',
            result: resultObj,
            count: resultObj.length
        });
        
    })
    .catch((err) => {
        res.status(500).send(err);
    })
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;