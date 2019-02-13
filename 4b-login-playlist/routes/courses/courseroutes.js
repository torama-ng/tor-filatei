const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const subjectsData = require('../../models/subject');

const videosPath = path.join(__dirname, '../../videos');
const videosPath2 = "";


// List all Courses/subjects and video files under them
router.get('/', ensureAuthenticated, (req,res,next) => {
    subq = req.query.subject;
    subjectsData.find( (err, doc)=>{
        
        if (err) res.status(404).send('Error Encountered');
        else if (doc) {
            if (subq){
                console.log(`subq is ${subq}`);
                res.render('listcourses', { 
                    title: 'List of subjects',
                    result: doc,
                    count:doc.length,
                    subq
                });    
            }
            else {
                res.render('listcourses', { 
                    title: 'List of Courses',
                    result: doc,
                    count: doc.length
                });
            }
            
        }
    })
    .exec()
    .then(() => {
        
    })
    .catch((err) => {
        res.status(500).send(err);
    })
})


// find and display one subject by name
router.get('/:name', ensureAuthenticated, (req,res,next) => {
    
    subject = req.params.name;
    
    subjectsData.findOne({name:subject}, (err, doc)=>{
        if (err) error = 'Error Encountered in model findOnes';
        else if (doc) {        
            courses = doc.courses;      
            count = courses.length;
            category = subject;

            res.render('search', { 
                title: 'Course Category',
                category,
                result: courses,
                count
            });
        }
    })
    .exec()
    .then(() => {
	  
    })
    .catch(() => {
        res.status(500).send('Error in Data fetch')
    })
})

// list courses under a subject
router.get('/:subject/:course', ensureAuthenticated, (req,res,next) => {
    subject = req.params.subject;
    course = req.params.course ;
    let result = [];
    subjectsData.findOne({name:subject}, (err, doc)=>{
        if (err) error = 'Error Encountered in model findOnes';
        else if (doc) {        
            doc.courses.forEach(cs => {
                if((cs.filename).toLowerCase().indexOf(course.toLowerCase()) > 0) {
                  //  res.send('Result found');
                    console.log(cs.filename);
                    console.log(course);
                    result.push( cs.filename);
                }
            }) ;
            
            count = result.length;          
            res.render('search', { 
                title: 'Search Result',
                result: result,
                count
            });
        }
      
    })
    .then(() => {

    })
    .catch(() => {
        res.status(500).send('Error in Data fetch')
    })
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;