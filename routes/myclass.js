const express = require('express')
  , router = express.Router()
  , models = require('../models');

  myclass_subject_no =1; //테스트  

const myclass_plan_category = 4;
const myclass_qna_category = 5;
const myclass_ppt_category = 6;

router.route('/').get((req,res)=> {
  
  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  res.render('student/myclass')
})

//강의 계획서
router.route('/plan').get((req,res)=> {

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  res.render('student/blog_1plan')  
})

//공지사항
router.route('/notice').get((req,res)=> {

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.Blog.findAll({
    where: { Blog_category: myclass_qna_category , Blog_subject_no : myclass_subject_no }
  }).then((result) => {
    return res.render('student/blog_2notice', { blog_list: result });
  });

  /*
  models.sequelize.Promise.all([
    models.Blog.findAll({
        where: { Blog_category: myclass_plan_category ,Blog_subject_no : myclass_subject_no },
        order: [['created_at', 'DESC']]
    }),

    
    models.Subject.findAll({
        where: { subject_user_no: req.session.userinfo[0] },
    }),
    
]).spread((returnNotice, returnSubject) => {
        return res.render('/student/blog_2notice', { blog_list: returnNotice, subject_list: returnSubject })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
*/
})

router.route('/notice/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.Blog.find({
    where: { blog_no: req.params.id }
  }).then((result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_2notice_check', { readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_2notice_check', { readBlog: result, writer: true });
    }

    res.render('student/blog_2notice_check', { readBlog: result, writer: false });
  }).catch((err)=> {
    //TODO : 오류처리
    res.send("테스트")
  })
});

//질의 응답
router.route('/qna').get((req,res)=> {

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.Blog.findAll({
    where: { Blog_category: myclass_qna_category , Blog_subject_no : myclass_subject_no }
  }).then((result) => {
    return res.render('student/blog_3qna', { blog_list: result });
  });
})

router.route('/qna/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.Blog.find({
    where: { blog_no: req.params.id }
  }).then((result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_3qna_check', { readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_3qna_check', { readBlog: result, writer: true });
    }

    res.render('student/blog_3qna_check', { readBlog: result, writer: false });
  }).catch((err)=> {
    //TODO : 오류처리
    res.send("테스트")
  })
});


router.route('/qna/insert')
  .get((req, res) => {

    if (!req.session.userinfo) {
      //TODO : 비정상 경로로 접근 오류처리
      res.redirect('/');
    }

    res.render('student/blog_3qna_write')
  })
  .post((req, res) => {

    if (!req.session.userinfo) {
      //TODO : 비정상 경로로 접근 오류처리
      res.redirect('/');
    }

    models.Blog.create({
      blog_category: myclass_qna_category,
      blog_title: req.body.title,
      blog_content: req.body.content,
      blog_user_no: req.session.userinfo[0],
      Blog_subject_no: myclass_subject_no,
    }).then((result) => {
      res.redirect('/myclass');
    }).catch((err) => {
      //TODO : 글작성 실패시 작성내용 쿠키에 저장
      res.send("<html><body><script>alert('글 작성 실패');</script></body>");
    });
  })

router.route('/qna/edit/:id')
  .get((req, res) => {

    models.Blog.find({
      where: { blog_no: req.params.id }
    }).then(function (result) {

      if (!result ) {
        return res.status(400).send("잘못된 경로로 접근했습니다.")
      }

      if (!req.session.userinfo) {
        //todo : 비정상 경로로 접근했습니다. 오류메세지 출력
        return res.status(401).redirect('/myclass/qna');
      }

      if (result.board_user_no != req.session.userinfo[0]) {
        //todo : 비정상 경로로 접근했습니다. 오류메세지 출력
        return res.status(401).redirect('/myclass/qna');
      }

      res.render('myclass/blog_3qnawrite', { data: result });
    }).catch((err) => {
      //TODO : 글이존재하지않을경우.. 잘못된 경로접근!!
      return res.redirect('/myclass');
    });

  })
  .post((req, res) => {

    const paramId = req.params.id;
    const body = req.body;

    models.Blog.update({
      blog_title: body.title, 
      blog_content: body.content, 
    }
      , {
        where: { blog_no: paramId }
      }).then((result) => {
        res.redirect('/myclass/read/' + paramId);
      }).catch((err) => {
        //TODO : 오류처리
      });
  });

router.route('/qna/delete/:id').get((req, res) => {

  models.Blog.find({
    where: { blog_no: req.params.id }
  }).then((result) => {

    if (!result ) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (result.board_user_no != req.session.userinfo[0]) {
      //TODO : 비정상 접근
      return res.render('/');
    }

    models.Board.destroy({
      where: { board_no: result.board_no }
    }).then((result) => {
      res.redirect('/myclass/');
    }).catch((err) => {
      //TODO: 오류처리
    });
  });
});

//강의 자료
router.route('/ppt').get((req,res)=> {

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.Blog.findAll({
    where: { Blog_category: myclass_ppt_category , Blog_subject_no : myclass_subject_no }
  }).then((result) => {
    return res.render('student/blog_4ppt', { blog_list: result });
  });

})

router.route('/ppt/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.Blog.find({
    where: { blog_no: req.params.id }
  }).then((result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_4ppt_check', { readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_4ppt_check', { readBlog: result, writer: true });
    }

    res.render('student/blog_4ppt_check', { readBlog: result, writer: false });
  }).catch((err)=> {
    //TODO : 오류처리
    res.send("테스트")
  })
});

//과제
router.route('/task')
.get((req,res)=> {

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.Blog.findAll({
    where: { Blog_category: myclass_qna_category , Blog_subject_no : myclass_subject_no }
  }).then((result) => {
    return res.render('student/blog_5hw', { blog_list: result });
  });

})

module.exports = router;