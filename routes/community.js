const express = require('express')
  , router = express.Router()
  , models = require('../models');

const category_num = 3;

router.route('/').get((req, res) => {

  if(! req.session.userinfo) {
    res.redirect('/');
  }
  
  models.Board.findAll({
    where: { board_category : category_num }
  }).then(function (result) {
    res.render('common/community', { data : result});
  });
});

router.route('/read/:id').get((req, res) => { 
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.Board.find({
    where: { board_no : req.params.id }
  }).then(function (result) {
    res.render('common/boardread', { data : result});
  });
});

router.route('/delete').get((req, res) => { });

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
      board_category : req.body.category,
      board_title: req.body.title,
      board_content: req.body.content,
      board_department : req.body.board_department, 
      user_id: req.session.userinfo[0],
    }).then(function (result) {
      console.dir(result);
      res.redirect('/community');
    }).catch(function (err) {
      //TODO : 글작성 실패시 작성내용 쿠키에 저장
      console.dir(err);
      res.send("<html><body><script>alert('글 작성 실패');</script></body>");
    });
  })


router.route('/edit/:id')
  .get((req, res) => { res.render('common/boardedit')})
  .post((req, res) => { });


module.exports = router;