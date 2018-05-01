const express = require('express')
  , multer = require('multer')
  , router = express.Router()
  , models = require('../models')
  , upload = multer({dest:'./tmp/'})
  , fs = require('fs');

const myclass_plan_category = 4;
const myclass_notice_category = 5;
const myclass_qna_category = 6;
const myclass_ppt_category = 7;
const myclass_task_category = 8;

router.route('/').get((req,res)=> {
  
  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

]).spread((returnSubject_no, returnSubject,) => {
        return res.render('student/myclass', { subject_no: returnSubject_no, subject_list: returnSubject })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
})

router.route('/:subject').get((req,res)=> {

  var req_subject_no = req.params.subject

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.findAll({
      where: { Blog_category: myclass_qna_category , Blog_subject_no : req_subject_no }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_1plan', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });

})

//강의 계획서
router.route('/:subject/plan').get((req,res)=> {

  var req_subject_no = req.params.subject

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.findAll({
      where: { Blog_category: myclass_qna_category , Blog_subject_no : req_subject_no }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_1plan', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });

})

//공지사항
router.route('/:subject/notice').get((req,res)=> {

  var req_subject_no = req.params.subject

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.findAll({
      where: { Blog_category: myclass_notice_category , Blog_subject_no : req_subject_no }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_2notice', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });

})
router.route('/:subject/notice/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.find({
      where: { blog_no: req.params.id }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_2notice_check', {subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_2notice_check', {subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: true });
    }
        res.render('student/blog_2notice_check', { subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: false })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
});

//질의 응답
router.route('/:subject/qna').get((req,res)=> {

  var req_subject_no = req.params.subject

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

 models.sequelize.Promise.all([

  models.Signupsubject.findAll({
    where: { signup_user_no : req.session.userinfo[0]}
  }),

  models.Subject.findAll({
  }),

  models.Blog.findAll({
    where: { Blog_category: myclass_qna_category , Blog_subject_no : req_subject_no }
  }),
  
]).spread((returnSubject_no, returnSubject,result) => {
      return res.render('student/blog_3qna', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
  }).catch(function (err) {
      //TODO : status 오류코드 보내기
      return res.redirect('/')
  });

})


router.route('/:subject/qna/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Upload.findAll({
      where: { blog_no: req.params.id }
    }),

    models.Blog.find({
      where: { blog_no: req.params.id }
    }),

]).spread((returnSubject_no, returnSubject,file,result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_3qna_check', {subject_no: returnSubject_no, subject_list: returnSubject,file_list: file, readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_3qna_check', {subject_no: returnSubject_no, subject_list: returnSubject,file_list: file, readBlog: result, writer: true });
    }
        res.render('student/blog_3qna_check', { subject_no: returnSubject_no, subject_list: returnSubject,file_list: file, readBlog: result, writer: false })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
});

router.route('/:subject/qna/insert').get((req, res) => {
  var req_subject_no = req.params.subject

  if (!req.session.userinfo) {
    //TODO : 비정상 경로로 접근 오류처리
    res.redirect('/');
  }

  
  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),
  
    models.Subject.findAll({
    }),
  
    models.Blog.findAll({
      where: { Blog_category: myclass_qna_category , Blog_subject_no : req_subject_no }
    }),
    
  ]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_3qna_write', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
})
.post((req, res) => {

  if (!req.session.userinfo) {
    //TODO : 비정상 경로로 접근 오류처리
    res.redirect('/');
  }

  fs.readFile(req.files.uploadFile.path,function(error,data) {
    var filePath = __dirname +'/uploads/'+req.files.uploadFile.name;
  })

  return models.sequelize.transaction(function (t) {
    const body = req.body;

    return models.User.find({
      where: { user_no: req.session.userinfo[0] }
    }, { transaction: t })
      .then(user_result => {

        return models.Blog.create({
          blog_category: myclass_qna_category,
          blog_title: req.body.title,
          blog_content: req.body.content,
          blog_user_no: user_result.user_no,
          blog_writer: user_result.user_name,
          blog_subject_no: req.params.subject,
        }, { transaction: t })
      })
  }).then((result) => {
    res.redirect('/myclass/'+req.params.subject+'/qna');
  }).catch((err) => {
    //TODO : 글작성 실패시 작성내용 쿠키에 저장
    console.log(err)
    res.send(`${err}`)
  })
})

router.route('/:subject/qna/edit/:id')
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

router.route('/:subject/qna/delete/:id').get((req, res) => {

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
router.route('/:subject/ppt').get((req,res)=> {

  var req_subject_no = req.params.subject

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.findAll({
      where: { Blog_category: myclass_ppt_category , Blog_subject_no : req_subject_no }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_4ppt', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
  
})
router.route('/:subject/ppt/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.find({
      where: { blog_no: req.params.id }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_4ppt_check', {subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_4ppt_check', {subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: true });
    }
        res.render('student/blog_4ppt_check', { subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: false })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
});

router.route('/:subject/ppt/insert').get((req, res) => {
  var req_subject_no = req.params.subject

  if (!req.session.userinfo) {
    //TODO : 비정상 경로로 접근 오류처리
    res.redirect('/');
  }
  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),
  
    models.Subject.findAll({
    }),
  
    models.Blog.findAll({
      where: { Blog_category: myclass_qna_category , Blog_subject_no : req_subject_no }
    }),
    
  ]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_4ppt_write', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
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
    blog_subject_no: req.params.subject,
  }).then((result) => {
    res.redirect('/myclass/'+req.params.subject+'/ppt');
  }).catch((err) => {
    //TODO : 글작성 실패시 작성내용 쿠키에 저장
    res.send("<html><body><script>alert('글 작성 실패');</script></body>");
  });
})


router.route('/:subject/ppt/edit/:id')
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

      res.render('myclass/blog_4ppt_write', { data: result });
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

router.route('/:subject/ppt/delete/:id').get((req, res) => {

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

//과제
router.route('/:subject/task').get((req,res)=> {

  var req_subject_no = req.params.subject

  if(!req.session.userinfo) {
    return res.redirect('/login');
  }

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.findAll({
      where: { Blog_category: myclass_task_category , Blog_subject_no : req_subject_no }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_5hw', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });

})
router.route('/:subject/task/read/:id').get((req, res) => {
  //TODO : 세션 검사 및 조회수 및 게시판 카테고리 출력

  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),

    models.Subject.findAll({
    }),

    models.Blog.find({
      where: { blog_no: req.params.id }
    }),
    
]).spread((returnSubject_no, returnSubject,result) => {

    if (!result) {
      return res.status(400).send("잘못된 경로로 접근했습니다.")
    }

    if (!req.session.userinfo) {
      return res.render('student/blog_5hw_check', {subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: false });
    }

    if (result.board_user_no == req.session.userinfo[0]) {
      return res.render('student/blog_5hw_check', {subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: true });
    }
        res.render('student/blog_5hw_check', { subject_no: returnSubject_no, subject_list: returnSubject, readBlog: result, writer: false })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
});

router.route('/:subject/task/insert').get((req, res) => {
  var req_subject_no = req.params.subject

  if (!req.session.userinfo) {
    //TODO : 비정상 경로로 접근 오류처리
    res.redirect('/');
  }
  models.sequelize.Promise.all([

    models.Signupsubject.findAll({
      where: { signup_user_no : req.session.userinfo[0]}
    }),
  
    models.Subject.findAll({
    }),
  
    models.Blog.findAll({
      where: { Blog_category: myclass_qna_category , Blog_subject_no : req_subject_no }
    }),
    
  ]).spread((returnSubject_no, returnSubject,result) => {
        return res.render('student/blog_5hw_submit', { subject_no: returnSubject_no, subject_list: returnSubject, blog_list: result })
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
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
    blog_subject_no: req.params.subject,
  }).then((result) => {
    res.redirect('/myclass/'+req.params.subject+'/task');
  }).catch((err) => {
    //TODO : 글작성 실패시 작성내용 쿠키에 저장
    res.send("<html><body><script>alert('글 작성 실패');</script></body>");
  });

  
})


router.route('/:subject/task/edit/:id')
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

      res.render('myclass/blog_5hw_submit', { data: result });
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
        res.redirect('/myclass/'+req.params.subject+'/task/read/' + paramId);
      }).catch((err) => {
        //TODO : 오류처리
      });
  });

router.route('/:subject/task/delete/:id').get((req, res) => {

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
        res.redirect('/myclass/'+req.params.subject+'/task');
      }).catch((err) => {
        //TODO: 오류처리
      });
    });
  });

  router.route('/download/:fileid').get((req, res) => {
    filename = req.params.fileid; //fileid = 각각의 파일을 구분하는 파일ID 값
      
      filepath = __dirname + "/uploads/" + filename;
      res.download(filepath);
  });

module.exports = router;