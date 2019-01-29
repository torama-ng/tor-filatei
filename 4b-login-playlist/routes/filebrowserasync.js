var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const videosPath = path.join(__dirname, '../videos');
// Async function to recursively generate file tree
// creates 'file' object with props 
// filePath, 
// isFileBoolean, and 
// files
const generateFileTreeObject = directoryString => {  
    return fs.readdirAsync(directoryString)
      .then(arrayOfFileNameStrings => {
        const fileDataPromises = arrayOfFileNameStrings.map(fileNameString => {
          const fullPath = `${directoryString}/${fileNameString}`;
          return fs.statAsync(fullPath)
            .then(fileData => {
              const file = {};
              file.filePath = fullPath;
              file.isFileBoolean = fileData.isFile();
              /*Here is where we'll do our recursive call*/
              if (!file.isFileBoolean) {
                return generateFileTreeObject(file.filePath)
                  .then(fileNamesSubArray => {
                    file.files = fileNamesSubArray;
                  })
                  .catch(console.error);
              }
              /*End recursive condition*/
              return file;
            });
        });
        return Promise.all(fileDataPromises);
      });
  };

  // call the async function
  generateFileTreeObject(videosPath)
      .then(files => {
        console.log(files);
      })
      .catch(console.error)

// display content of this folder 
var fileObj = [];
// Function to list folders in videos dir
function fbrowse(dir,id,pid) {
	console.log('[+]'+ dir);
	childObj = filesArr = [];
	var files = fs.readdirSync(dir);
	folderName = path.basename(dir);
	childObj = returnDirs(files,dir);
	filesArr = returnFiles(files,dir);
	
	fileObj.push({"folder":folderName,"id":id, "parentid":pid,"files":filesArr,"children":childObj})
	
	for (x in files) {
		var next = path.join(dir,files[x]);

		if (fs.lstatSync(next).isDirectory() == true){
			id = id+1;
			fbrowse(next,id,pid);
		}
		else {
			
			console.log(next);
		}
		
	}
	pid = id;
}

function returnDirs (arr,dir) {
	dirArr = [];
	
	for (x in arr) {
		var xp = path.join(dir,arr[x]);
		if (fs.lstatSync(xp).isDirectory() == true){
			
			dirArr.push(xp);
		}
		else {
			
			console.log(xp);
		}
	}
	return dirArr;
}

function returnFiles (arr,dir) {
	filesArr = [];
	
	for (x in arr) {
		var xp = path.join(dir,arr[x]);
		if (fs.lstatSync(xp).isDirectory() == true){
			
			console.log(xp);
		}
		else {
			filesArr.push(xp);
			
		}
	}
	return filesArr;
}

fbrowse(videosPath,1,1);
// fileObj = JSON.stringify(fileObj);

console.log(fileObj);
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
		
		res.render('fselect', { 
			videoTitle: 'Folder Content',
			videoGroup: fileObj,
			videoDir: 'Folders',
			
		
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