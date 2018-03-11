const express = require('express')
  , router = express.Router()
  , models = require('../models');


router.route('/').get((req, res) => res.render('common/editor'));



module.exports = router;