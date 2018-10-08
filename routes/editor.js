const express = require('express');
const router = express.Router();
const service = require('./service/compileService');

router.all('*', (req, res, next) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login');
  }
  next('route');
});

router.route('/').get(service.index);
router.route('/c').post(service.cCompile);
router.route('/java').post(service.javaCompile);
router.route('/python').post(service.pythonCompile);
router.route('/pro/editor').get((req, res) => {
  return res.render('professor/editor', { readcode: false });
});


module.exports = router;
