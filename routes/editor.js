const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , fs = require('fs')
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

router.route('/java').post((req, res) => {
  const content = req.body.content
  const date = new Date()
  const filename = Date.now() + '-' + req.session.userinfo[0];
  let editlogNo;

  editFunc.createLog(filename, req.session.userinfo[0], 'java', editLog => {
    editlogNo = editLog;
  })

  editFunc.saveCode(filename, content, 'java')

  editFunc.javaCompile(editlogNo, data => {
    return res.send({ result: true, content: data });
  })
})

router.route('/c').post((req, res) => {
  if (!req.session.userinfo) {
    return res.status(401).send({ result: false });
  }
  const content = req.body.content;
  const filename = Date.now() + '-' + req.session.userinfo[0];
  let editlogNo;

  editFunc.createLog(filename, req.session.userinfo[0], 'c', editLog => {
    editlogNo = editLog;
  })
  editFunc.saveCode(filename, content, 'c')

  editFunc.compileFunc(editlogNo, filename,'c', data => {
    return res.send({ result: true, content: data });
  })
})

router.route('/python').post((req, res) => {
  if (!req.session.userinfo) {
    return res.send({ result: false });
  }
  const content = req.body.content;
  const filename = Date.now() + '-' + req.session.userinfo[0];
  let editlogNo;

  editFunc.createLog(filename, req.session.userinfo[0], 'python', editLog => {
    editlogNo = editLog;
  })
  editFunc.saveCode(filename, content, 'python')

  editFunc.compileFunc(editlogNo, filename, 'python', data => {
    return res.send({ result: true, content: data });
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
