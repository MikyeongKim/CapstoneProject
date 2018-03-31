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

    return models.sequelize.transaction(function (t) {
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
    //게시판 학과 카테고리 만들기
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
      .spread((findResult, updateResult, replyResult) => {

        if (!findResult) {
          return res.status(400).send('잘못된 경로로 접근했습니다.')
        }

        if (!req.session.userinfo) {
          return res.render('common/boardread', { readBoard: findResult, reply: replyResult })
        }

        if (findResult.board_user_no == req.session.userinfo[0]) {
          return res.render('student/boardread', { readBoard: findResult, writer: true, reply: replyResult })
        }

        return res.render('student/boardread', { readBoard: findResult, writer: false, reply: replyResult })

      }).catch(function (err) {
        return res.status(400).send(err)
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
        res.send({result : true})
      }).catch((err) => {
        console.log("에러러러러")
        console.dir(err)
      })
  })
  .delete((req, res) => {

    models.Board.find({
      where: { board_no: req.params.id }
    }).then((result) => {

      if (!result) {
        return res.status(400).send('잘못된 경로로 접근했습니다.')
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        return res.render('/')
      }

      models.Board.destroy({
        where: { board_no: result.board_no }
      }).then((result) => {
        res.status(200).send({ result: true })
      }).catch((err) => {
      })
    })
  })


router.route('/:id/new')
  .get((req, res) => {

    if (!req.session.userinfo) {
      //TODO : 비정상 경로로 접근 오류처리
      res.redirect('/')
    }

    res.render('common/boardinsert')
  })

router.route('/:id/edit')
  .get((req, res) => {

    models.Board.find({
      where: { board_no: req.params.id }
    }).then(function (result) {

      if (!result) {
        return res.status(400).send('잘못된 경로로 접근했습니다.')
      }

      if (!req.session.userinfo) {
        //todo : 비정상 경로로 접근했습니다. 오류메세지 출력
        return res.status(401).redirect('/community')
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        //todo : 비정상 경로로 접근했습니다. 오류메세지 출력
        return res.status(401).redirect('/community')
      }

      res.render('common/boardedit', { data: result })
    }).catch((err) => {
      //TODO : 글이존재하지않을경우.. 잘못된 경로접근!!
      return res.redirect('/community')
    })

  })




module.exports = router
