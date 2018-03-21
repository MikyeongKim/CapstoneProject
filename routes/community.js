const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , multer = require('multer')
  , upload = multer({dest : 'uploads/'})

const community_category = 3;

router.route('/').get((req, res) => {

  models.Board.findAll({
    where: { board_category: community_category }
  }).then((result) => {

    if (!req.session.userinfo) {
      return res.render('common/community', { board_list: result });
    }

    return res.render('student/community', { board_list: result });
  });
});

router.route('/read/:id').get((req, res) => {
  //게시판 학과 카테고리 만들기

  const req_board_no = req.params.id

  models.sequelize.Promise.all([
    models.Board.find({
      where: { board_no: req_board_no }
    }),

    models.Board.update({
      board_count: models.sequelize.literal('board_count+1')
    }, { where: { board_no: req_board_no } })
  ])
    .spread((findResult, updateResult) => {

      if (!findResult) {
        return res.status(400).send("잘못된 경로로 접근했습니다.")
      }
      
      if (!req.session.userinfo) {
        return res.render('common/boardread', { readBoard: findResult });
      }

      

      if (findResult.board_user_no == req.session.userinfo[0]) {
        return res.render('student/boardread', { readBoard: findResult, writer: true });
      }

      return res.render('student/boardread', { readBoard: findResult, writer: false });

    }).catch(function (err) {
      return res.status(400).send(err)
    });


});

router.route('/insert')
  .get((req, res) => {

    if (!req.session.userinfo) {
      //TODO : 비정상 경로로 접근 오류처리
      res.redirect('/');
    }

    res.render('common/boardinsert')
  })
  .post(upload.array('upfile',12),(req, res) => {

    if (!req.session.userinfo) {
      //TODO : 비정상 경로로 접근 오류처리
      res.redirect('/');
    }

    models.Board.create({
      board_category: community_category,
      board_title: req.body.title,
      board_content: req.body.content,
      board_department: req.body.board_department,
      board_user_no: req.session.userinfo[0]
    }).then((result) => {
      res.redirect('/community');
    }).catch((err) => {
      //TODO : 글작성 실패시 작성내용 쿠키에 저장
      res.send("<html><body><script>alert('글 작성 실패');</script></body>");
    });
  })

router.route('/edit/:id')
  .get((req, res) => {

    models.Board.find({
      where: { board_no: req.params.id }
    }).then(function (result) {

      if (!result) {
        return res.status(400).send("잘못된 경로로 접근했습니다.")
      }

      if (!req.session.userinfo) {
        //todo : 비정상 경로로 접근했습니다. 오류메세지 출력
        return res.status(401).redirect('/community');
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        //todo : 비정상 경로로 접근했습니다. 오류메세지 출력
        return res.status(401).redirect('/community');
      }

      res.render('common/boardedit', { data: result });
    }).catch((err) => {
      //TODO : 글이존재하지않을경우.. 잘못된 경로접근!!
      return res.redirect('/community');
    });

  })
  .post((req, res) => {

    const paramId = req.params.id;
    const body = req.body;

    models.Board.update({
      board_title: body.title,
      board_content: body.content,
      board_department: body.board_department
    }
      , {
        where: { board_no: paramId }
      }).then((result) => {
        res.redirect('/community/read/' + paramId);
      }).catch((err) => {
        //TODO : 오류처리
      });
  });

router.route('/delete/:id').get((req, res) => {

  models.Board.find({
    where: { board_no: req.params.id }
  }).then((result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (result.board_user_no != req.session.userinfo[0]) {
      //TODO : 비정상 접근
      return res.render('/');
    }

    models.Board.destroy({
      where: { board_no: result.board_no }
    }).then((result) => {
      res.redirect('/community/');
    }).catch((err) => {
      //TODO: 오류처리
    });
  });
});

module.exports = router;