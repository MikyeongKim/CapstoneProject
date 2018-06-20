const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , editFunc = require('./func/editfunc')

const student = 1

router.route('/').get((req, res) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  }

  if (req.session.userinfo[1] === student) {
    return res.render('student/editor');
  }
  return res.render('student/editor', { readcode: false });
})

router.route('/c').post((req, res) => {
  /*
  if (!req.session.userinfo) {
    return res.status(401).send({ result: false });
  }*/
  const content = req.body.content;
  const param = req.body.params;

  editFunc.paramExecute(content,param, 1, 'c', result => {
    return res.send({ result: true, content: result });
  })
  /*
  editFunc.logicExecute(content, 1, 'c', result => {
    return res.send({ result: true, content: result });
  })
*/
})

router.route('/java').post((req, res) => {
  const content = req.body.content
  const date = new Date()
  const filename = Date.now() + '-' + 1;
  //const filename = Date.now() + '-' + req.session.userinfo[0];
  let editlogNo;

  editFunc.logicExecute(content, 1, 'java', result => {
   
    return res.send({ result: true, content: result });
  })
})

router.route('/python').post((req, res) => {
  /*
  if (!req.session.userinfo) {
    return res.send({ result: false });
  }*/
  const content = req.body.content;

  editFunc.logicExecute(content, 1, 'python', result => {
    return res.send({ result: true, content: result });
  })
})

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
