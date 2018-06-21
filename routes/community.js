const express = require('express'),
  router = express.Router(),
  models = require('../models')
  , service = require('./func/communityService')


const community_category = 3

router.route('/').get((req, res) => {
  let path;
  var currentPage = req.param('page');
  if (currentPage == null) {
    currentPage = 1;
  }

  var limitList = 3;
  var skipList = (currentPage - 1) * limitList;
  var limitPage = 3;
  var startPage = Math.floor((currentPage - 1) / limitPage) * limitPage + 1;
  var endPage = startPage + limitPage - 1;

  {

    service.listAllCommunity(result => {

      // 총 게시물수
      var totalCount = result.length;
      // 총 페이지수
      var pageNum = Math.ceil(totalCount / limitList);
      // 총 페이지수는 종료 페이지수
      if (endPage > pageNum) {
        endPage = pageNum
      }

      // 해당 페이지에 맞는 리스트 슬라이싱
      resultSet = result.slice(skipList, skipList + limitList)

      if (!req.session.userinfo) {
        path = 'common'
      } else {
        path = 'student'
      }

      // 보낼 때 좀조잡하네...
      return res.render(`${path}/community`, {
        board_list: resultSet,
        skipList,
        startPage,
        endPage,
        pageNum,
        limitPage
      })
    })
  }
})

router.route('/').post((req, res) => {

  if (!req.session.userinfo) {
    res.status(401).redirect('/')
  }
  const body = req.body;
  const params = {
    userno: req.session.userinfo[0], content: req.body.content
    , title: req.body.title, board_department: req.body.board_department
  }

  service.createCommunity(params, (err,result) => {
    res.redirect('/community')
  })
})



router.route('/:id').get((req, res) => {
  const req_board_no = req.params.id

  if (!req.session.userinfo) {
    service.readCommunity(req_board_no, (err, result) => {
      if (err) {
        return res.status(500).send(err)
      }
      if (result == false) {
        return res.status(400).send('Bad Request')
      }
      return res.render('common/boardread'
        , { readBoard: result.boardResult, reply: result.replyResult })
    })
  }
  else {
    models.sequelize.Promise.all([
      models.Board.find({
        where: {
          board_no: req_board_no
        }
      }),

      models.Board.update({
        board_count: models.sequelize.literal('board_count+1')
      }, {
          where: {
            board_no: req_board_no
          }
        }),

      models.Reply.findAll({
        where: {
          board_no: req_board_no
        }
      })
    ]).spread((boardResult, updateResult, replyResult) => {

      if (!boardResult) {
        return res.status(400).send('400 Bad Request')
      }
      IsWriter(replyResult, req.session.userinfo[0])

      if (boardResult.board_user_no == req.session.userinfo[0]) {
        return res.render('student/boardread', {
          readBoard: boardResult,
          writer: true,
          reply: replyResult
        })
      }

      return res.render('student/boardread', {
        readBoard: boardResult,
        writer: false,
        reply: replyResult
      })
    }).catch((err) => {
      return res.status(505).send("505 Server error")
    });
  }
})

router.route('/:id').put((req, res) => {
  const paramId = req.params.id
  const body = req.body

  models.Board.update({
    board_title: req.body.title,
    board_content: req.body.content,
    board_department: req.body.board_department
  }, {
      where: {
        board_no: paramId
      }
    }).then((result) => {
      res.send({
        result: true
      })
    }).catch((err) => {
      console.log("에러러러러")
      return res.status(503).send("503 Service Unavailable")
    })
})
  .delete((req, res) => {

    models.Board.find({
      where: {
        board_no: req.params.id
      }
    }).then((result) => {

      if (!result) {
        return res.status(400).send('400 Bad Request')
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        return res.render('/')
      }

      models.Board.destroy({
        where: {
          board_no: result.board_no
        }
      }).then((result) => {
        res.send({
          result: true
        })
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
      where: {
        board_no: req.params.id
      }
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

      res.render('common/boardedit', {
        data: result
      })
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
