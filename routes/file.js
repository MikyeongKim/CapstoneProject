const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , multer = require('multer')
  , fs = require('fs')

const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname ) //파일저장될때 현재시간 + 파일이름으로 저장됨 ok?
  }
})

const upload = multer({ storage: _storage })


router.route('/')
  .get((req, res) => {
    res.render('common/file')
  })
  .post(upload.array('userfile', 5), (req, res) => {
    console.log(req.files)

    if (!SavedFile(req.files)) {
      return res.status(500).send("파일전송실패")
    }

    return res.status(303).redirect('/community')

  })

function SavedFile(files) {   //실제 파일이 저장되있는지 확인하는 함수 
  const file_len = files.length
  console.log(files)

  for (let i = 0; i < file_len; i++) {
    //files[i].path 가 저장된 path + 파일명이다. ok?
    fs.stat(files[i].path, function (err, stat) {  
      if (err) {
        return false
      }
    })
  }
  return true
}

module.exports = router
