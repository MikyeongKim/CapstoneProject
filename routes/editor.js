const express = require('express');
const router = express.Router();
const editFunc = require('./func/editfunc');
const service = require('./service/compileService');
const student = 1;

router.all('*', (req, res, next) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login');
  }
  next('route');
});

router.route('/').get(service.index);
router.route('/c').post(service.cCompile);

router.route('/java').post(service.javaCompile);

router.route('/python').post((req, res) => {
  const content = req.body.content;
  const param = req.body.params;

  if (param == 'false') {
    editFunc.logicExecute(content, 1, 'python', result => {
      return res.send({ result: true, content: result });
    });
  } else {
    editFunc.paramExecute(content, param, 1, 'python', result => {
      return res.send({ result: true, content: result });
    });
  }
});

router.route('/pro/editor').get((req, res) => {
  return res.render('professor/editor', { readcode: false });
});

/*
router.route('/read/:no&:lang').get((req, res) => {
  const lang = req.params.lang;
  const edit_log_no = req.params.no;

  models.Editlog.find({
    where: { edit_no: edit_log_no }
  }).then(result => {
    let path = result.edit_filepath + "origin-" + result.edit_filename + '.txt';
    fs.readFile(path, 'utf-8', (error, data) => {
      if (error) {
        res.send(`error ${error}`)
      }
      console.log(data)
      res.render('professor/editor', { readcode: true, code_content: data, code_lang: lang })
    })
  })
})
*/
module.exports = router;
