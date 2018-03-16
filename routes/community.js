const express = require('express')
  , router = express.Router()
  , models = require('../models');

const category_num = 3;

router.route('/').get((req, res) => {

  if (!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.Board.findAll({
    where: { board_category: category_num }
  }).then(function (result) {
    return res.render('common/community', { data: result });
  });
});

router.route('/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.Board.find({
    where: { board_no: req.params.id }
  }).then(function (result) {

    if(! req.session.userinfo) {
      return res.render('common/boardread', { data: result, writer: false });  
    }

    if (result.user_id == req.session.userinfo[0]) {
      return res.render('common/boardread', { data: result, writer: true });
    }

    res.render('common/boardread', { data: result, writer: false });
  });
});



router.route('/insert')
  .get((req, res) => {

    if (!req.session.userinfo) {
      res.redirect('/');
    }

    res.render('common/boardinsert')
  })
  .post((req, res) => {

    if (!req.session.userinfo) {
      res.redirect('/');
    }

    const today = new Date();

    models.Board.create({
      board_category: category_num,
      board_title: req.body.title,
      board_content: req.body.content,
      board_department: req.body.board_department,
      user_id: req.session.userinfo[0],
    }).then(function (result) {
      console.dir(result);
      res.redirect('/community');
    }).catch((err) => {
      //TODO : 글작성 실패시 작성내용 쿠키에 저장
      console.log(err);
      res.send("<html><body><script>alert('글 작성 실패');</script></body>");
    });
  })


router.route('/edit/:id')
  .get((req, res) => {

    models.Board.find({
      where: { board_no: req.params.id }
    }).then(function (result) {

      if (!req.session.userinfo) {
        //todo : 잘못된 경로로 접근했습니다. 오류메세지 출력
        return res.redirect('/community');
      }

      if (result.user_id != req.session.userinfo[0]) {
        //todo : 잘못된 경로로 접근했습니다. 오류메세지 출력
        return res.redirect('/community');
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
      baord_title: body.title, board_content: body.content
      , board_department: body.board_department
    }
      , {
        where: { board_no: paramId }
      }).then(function (result) {
        res.redirect('/community/read/' + paramId);
      }).catch(function (err) {
        //TODO: error handling
      });
  });

router.route('/delete/:id').get((req, res) => {

  models.Board.find({
    where: { board_no: req.params.id }
  }).then(function (result) {
    if (result.user_id != req.session.userinfo[0]) {
      //TODO : 잘못된 접근.. 
      return render('/');
    }

    models.Board.destroy({
      where: { board_no: req.params.id }
    }).then(function (result) {
      res.redirect('/community/');
    }).catch(function (err) {
      //TODO: error handling
    });

  });

});


module.exports = router;