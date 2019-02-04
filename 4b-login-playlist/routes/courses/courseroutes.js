const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const subjectsData = require('../../models/subject');

const videosPath = path.join(__dirname, '../../videos');
const videosPath2 = "";

//dataloader - loads toplevel courses/subjects and video class files
router.get('/dataloader', ensureAuthenticated, (req,res,next) => {
    // check environment
    if (process.env.PLATFORM != "PROD"){
        return res.send('This is not PROD environment. Data not loaded');
    }
	subjects = fs.readdirSync(videosPath2);
	
	subjects.forEach(folder => {
	  
	  // First check the folder if it exists on the collection, before inserting
		subjectsData.findOne({name:folder}, (err, doc)=>{
			if (err) return res.status(404).send('Error Encountered');
			else if (doc) {
                // Folder already exists in the collection, 
                // so insert video files
					
                mpath = path.join(videosPath,folder);
                files = fs.readdirSync(mpath);
                doc.courses = [];
                files.forEach(mp4 => {
                    mp4path = path.join(mpath,mp4);
                    console.log(` mp4 files ${mp4path}`);
                    if  (fs.lstatSync(mp4path).isFile())
                    {
                        let course = {filename:mp4} 
                        
                        // var subject = new subjectsData();
                        console.log (`inserting ${mp4} ${doc}`);
                        doc.courses.push(course);
                        console.log (`inserting ${mp4} ${doc}`);
                        doc.save()
                        .then(function () {
                            console.log(`${mp4} inserted into ${doc}`);
                        })
                        .catch((err) => {
                            console.log(`error inserting course ${mp4} into ${doc}`)
                        });
                    }

				})
			}
			else {
				var item = {
					name: folder
				}
	
			// subjects to dcollection
				var subject = new subjectsData(item);
				subject.save()
				.then (function () {
					console.log('subject saved');
					return res.send('subject saved');
				},function(err){
                    if (err) {
                        console.log('error saving subject');
                        return res.status(404).send('Error saving subject');
                    }
				})  	
			} // end main else
		}) // end of subjectsData.findOne
	}); //end of subjects.forEach
    res.send('Data Loaded');
  })

// List all Courses/subjects and video files under them
router.get('/', ensureAuthenticated, (req,res,next) => {
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
})


// find and display one course/subject by name
router.get('/:name', ensureAuthenticated, (req,res,next) => {
    
    subject = req.params.name;
    let result = [];
    subjectsData.findOne({name:subject}, (err, doc)=>{
        if (err) error = 'Error Encountered in model findOnes';
        else if (doc) {
            
            doc.courses.forEach(cs => {                    
                 //  res.send('Result found');
                console.log(cs.filename);
                result.push( cs.filename);
            })           
        }
    })
    .then(() => {
	    res.render('search', { 
            title: 'Course Category',
            result: result,
            count: result.length
        });
    })
    .catch(() => {
        res.status(500).send('Error in Data fetch')
    })
})

// list courses under a subject
router.get('/:subject/:course', ensureAuthenticated, (req,res,next) => {
    subject = req.params.subject;
    course = req.params.course || req.query.course;
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
            })           
        }
      
    })
    .then(() => {
        
	    res.render('search', { 
            title: 'Search Result',
            result: result,
            count: result.length
        });
        
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