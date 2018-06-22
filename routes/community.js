const express = require('express'),
  router = express.Router(),
  models = require('../models')
  , service = require('./func/communityService')


const community_category = 3

router.route('/').get((req, res) => {
  let path;
  let currpage = req.param('page');
  if (currpage == null) {
    currpage = 1;
  }

  service.listAllCommunity(result => {
    resultSet = BoardPaging(currpage, result)

    if (!req.session.userinfo) {
      path = 'common'
    } else {
      path = 'student'
    }

    return res.render(`${path}/community`, {
      board_list: resultSet
    })
  })
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

function BoardPaging(currentPage, result){
  var limitList = 10;
  var skipList = (currentPage - 1) * limitList;
  var limitPage = 10;
  var startPage = Math.floor((currentPage - 1) / limitPage) * limitPage + 1;
  var endPage = startPage + limitPage - 1;
  var prevPage = startPage - limitPage

  var totalCount = result.length;
  var pageNum = Math.ceil(totalCount / limitList);
  if (endPage > pageNum) {
    endPage = pageNum
  }

  resultSet = result.slice(skipList, skipList + limitList)
  resultSet.skip = skipList
  resultSet.startp= startPage
  resultSet.endp= endPage
  resultSet.lastp= pageNum
  resultSet.prevp= prevPage

  return resultSet
}

module.exports = router
