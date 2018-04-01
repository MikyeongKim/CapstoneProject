const express = require('express')
  , router = express.Router()
  , models = require('../models')


const community_category = 3

router.route('/')
  .get((req, res) => {

    models.Board.findAll({
      where: { board_category: community_category },
      order: [['created_at', 'DESC']]
    }).then((result) => {

      if (!req.session.userinfo) {
        return res.render('common/community', { board_list: result })
      }

      return res.render('student/community', { board_list: result })
    })
  })
  .post((req, res) => {

    if (!req.session.userinfo) {
      //TODO : 비정상 경로로 접근 오류처리
      res.redirect('/')
    }

    return models.sequelize.transaction((t) => {
      const body = req.body;

      return models.User.find({
        where: { user_no: req.session.userinfo[0] }
      }, { transaction: t })
        .then(user_result => {

          return models.Board.create({
            board_category: community_category,
            board_title: req.body.title,
            board_content: req.body.content,
            board_department: req.body.board_department,
            board_user_no: user_result.user_no,
            board_writer: user_result.user_name
          }, { transaction: t })
        })
    }).then((result) => {
      res.redirect('/community')
    }).catch((err) => {
      //TODO : 글작성 실패시 작성내용 쿠키에 저장
      console.log(err)
      res.send(`${err}`)
    })
  })



router.route('/:id')
  .get((req, res) => {
    const req_board_no = req.params.id

    models.sequelize.Promise.all([
      models.Board.find({
        where: { board_no: req_board_no }
      }),

      models.Board.update({
        board_count: models.sequelize.literal('board_count+1')
      }, { where: { board_no: req_board_no } }),

      models.Reply.findAll({
        where: { board_no: req_board_no }
      })
    ])
      .spread((boardResult, updateResult, replyResult) => {

        if (!boardResult) {
          return res.status(400).send('400 Bad Request')
        }

        if (!req.session.userinfo) {
          return res.render('common/boardread', { readBoard: boardResult, reply: replyResult })
        }

        IsWriter(replyResult, req.session.userinfo[0])

        if (boardResult.board_user_no == req.session.userinfo[0]) {
          return res.render('student/boardread', { readBoard: boardResult, writer: true, reply: replyResult })
        }

        return res.render('student/boardread', { readBoard: boardResult, writer: false, reply: replyResult })

      }).catch((err) => {
        //TODO :: 에러처리 
        return res.status(503).send("503 Service Unavailable")
      })
  })
  .put((req, res) => {

    const paramId = req.params.id
    const body = req.body

    models.Board.update({
      board_title: req.body.title,
      board_content: req.body.content,
      board_department: req.body.board_department
    }
      , {
        where: { board_no: paramId }
      }).then((result) => {
        res.send({ result: true })
      }).catch((err) => {
        console.log("에러러러러")
        return res.status(503).send("503 Service Unavailable")
      })
  })
  .delete((req, res) => {

    models.Board.find({
      where: { board_no: req.params.id }
    }).then((result) => {

      if (!result) {
        return res.status(400).send('400 Bad Request')
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        return res.render('/')
      }

      models.Board.destroy({
        where: { board_no: result.board_no }
      }).then((result) => {
        res.send({ result: true })
      }).catch((err) => {
        return res.status(503).send("503 Service Unavailable")
      })
    })
  })


router.route('/:id/new')
  .get((req, res) => {

    if (!req.session.userinfo) {
      res.status(401).redirect('/')
    }

    res.render('common/boardinsert')
  })

router.route('/:id/edit')
  .get((req, res) => {

    models.Board.find({
      where: { board_no: req.params.id }
    }).then((result) => {

      if (!result) {
        return res.status(400).send('400 Bad Request')
      }

      if (!req.session.userinfo) {
        return res.status(401).redirect('/community')
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        return res.status(401).redirect('/community')
      }

      res.render('common/boardedit', { data: result })
    }).catch((err) => {
      return res.status(400).redirect('/community')
    })

  })

function IsWriter(data, id) {
  const length = data.length
  for (let i = 0; i < length; i++) {
    if (data[i].board_user_no === id) {
      data[i].isWriter = true
    }
  }
}

module.exports = router
