var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const subjectsData = require('../models/subject');
const videosPath = path.join(__dirname, '../videos');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	// Function to list folders in videos dir
	var folders = fs.readdirSync(videosPath);


	// Each folder is a video category.
	// for each category, get all the mp4 files
	catObj = [];  //store all folders and their mp4files
	let mtime = 0;
	folders.forEach(function (folder,index){
		fpath = path.join(__dirname, '../videos',folder);
		
		mp4files = fs.readdirSync(fpath);
		let stats = fs.statSync(fpath);
		mtime = new Date(stats.mtime);
		let seconds = (new Date().getTime() - stats.mtime) / 1000;
		let gid = stats.dev + stats.ino;
		let days = (seconds/(60*60*24)).toFixed(0);
		console.log(`modification time ${days} days`);	
		catObj.push({category:folder,files:mp4files,mtime:days,gid:gid})
	});

  	
	res.render('listcourses', { 
	videoTitle: 'Dashboard',
	videoGroup: catObj,
	videoDir: 'Dashboard',
	

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