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
    cb(null, file.originalname)
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

function SavedFile(files) {
  const file_len = files.length

  for (let i = 0; i < file_len; i++) {
    fs.stat(files[i].path, function (err, stat) {
      if (err) {
        return false
      }
    })
  }

  return true
}

module.exports = router
