const express = require('express')
  , router = express.Router()
  , models = require('../models');
const exec = require('child_process');

router.route('/')
.get((req, res) => res.render('common/editor'))
.post((req,res) => {
  const body = req.body;
  
  exec.exec("javacompile.bat CalculatorMain input.txt", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});



module.exports = router;