const express = require('express')
  , router = express.Router()
  , models = require('../models');

router.route('/').get((req,res)=> {
  
  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  res.render('student/myclass')
})

module.exports = router;