var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const subjectsData = require('../models/subject');
// const videosPath = path.join(__dirname, '../videos');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	
    subjectsData.find({}, (err, result)=>{
        if (err) return res.status(404).send('Error Encountered');
        if (result) {
            
            // docj = JSON.stringify(doc);
            count = result.length;
            
            res.render('listcourses', { 
                title: 'List of Courses',
                result,
                count
            });
        
        }
    })
    .then(() => {
        
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