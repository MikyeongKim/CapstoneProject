const express = require('express')
  , multer = require('multer')
  , router = express.Router()
  , models = require('../models')
  , upload = multer({dest:'./tmp/'})
  , fs = require('fs')
  ,app = express();


  app.post('/upload',function(req,res){
      fs.readFile(req.files.uploadFile.path,function(error,data) {
          var filePath = __dirname +'/uploads/'+req.files.uploadFile.name;
        

      })
  })