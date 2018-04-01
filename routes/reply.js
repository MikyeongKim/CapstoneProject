const express = require('express')
  , router = express.Router()
  , models = require('../models')


router.route('/')
  .post((req, res) => {

    if (!req.session.userinfo) {
      return res.status(401).redirect('/login')
    }

    const id = req.session.userinfo[0]
    const body = req.body;

    return models.sequelize.transaction(function (t) {

      return models.User.find({
        where: { user_no: id }
      }, { transaction: t })
        .then(user_result => {

          return models.Reply.create({
            reply_content: body.content,
            reply_writer: user_result.user_name,
            board_no: body.board_no,
            board_user_no: id,
          }, { transaction: t })
        })
    }).then((resultCreate) => {

      models.Reply.findAll({
        where: { board_no: body.board_no }
      }).then((replyResult) => {

        return res.send({ result: replyResult });
      })
    }).catch((err) => {
      console.log(err)
      res.status(503).send("503 Service Unavailable")
    })

  })

router.route('/:id')
  .delete((req, res) => {

    models.Reply.find({
      where: { reply_no: req.params.id }
    })
      .then((replyResult) => {

        if (!replyResult) {
          return res.status(400).send('400 Bad Request')
        }

        if (!req.session.userinfo) {
          return res.status(401).send('401 Unauthorized')
        }

        if (replyResult.board_user_no !== req.session.userinfo[0]) {
          return res.status(403).send('403 Forbidden')
        }

        models.Reply.destroy({
          where: { reply_no: req.params.id }
        }).then((result) => {
          return res.json({ result: true })
        })
      }).catch((err) => {
        res.send("503 Service Unavailable")
      })

  })


function IsWriter(data, id) {
  const length = data.length
  for (let i = 0; i < length; i++) {
    if (data.user_no === id)
      data.isWriter = true
  }
}

module.exports = router