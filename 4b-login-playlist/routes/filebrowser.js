var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const videosPath = path.join(__dirname, '../videos');

// display content of this folder 

// Function to list folders in videos dir
var folders = fs.readdirSync(videosPath);



// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
  	
	  res.render('fselect', { 
		videoTitle: 'Folder Content',
		videoGroup: folders,
		videoDir: 'Udemy',
		
	
	  });
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