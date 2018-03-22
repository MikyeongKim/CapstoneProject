const express = require('express')
  , router = express.Router()
  , models = require('../models')


router.route("/insert/:board_no").post((req, res) => {

  console.log(`컨텐트 ${req.body.content} 보드넘버 ${req.params.board_no}`)
  return res.send({ result: true })
  /*
  models.Reply.create({
    reply_content :  req.body.content,
    board_no : req.params.board_no
  }).then((result) => {
    return res.send({ result: true })

  }) */
})

module.exports = router