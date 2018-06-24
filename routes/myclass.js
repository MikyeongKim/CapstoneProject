const express = require('express')
  , router = express.Router()
  , service = require('./service/myclassService')
  , taskService = require('./service/taskService')
  , multer = require('multer');

const _notice_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/notice')
  },
  filename: function (req, file, cb) {
    cb(null, `${req.session.userinfo[0]}-${Date.now()}-${file.originalname}`);
  }
});

const noticeFile = multer({ storage: _notice_storage })

const Student = 1
  , Professor = 2;

router.all('*', (req, res, next) => {
  req.session.userinfo = [1, 1];

  /*
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  } */
  next('route')
})



router.route('/').get((req, res) => {
  const userGrade = req.session.userinfo[1];
  const userno = req.session.userinfo[0];

  if (userGrade === Student) {

    service.findClassByStu(userno, (err, result) => {
      if (err) {
        return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
      }
      return res.render('student/myclass', { myclass: result })
    })

  } else {
    service.findClassByPro(userno, (err, result) => {
      if (err) {
        return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
      }
      return res.render('professor/myclass', { myclass: result })
    })
  }

})

router.route(['/:id/main/', '/:id/plan/']).get((req, res) => {
  const subject_no = req.params.id
  const userGrade = req.session.userinfo[1];

  let path = 'professor';
  if (userGrade === Student) {
    path = 'student'
  }

  service.findPlanByAll(subject_no, (err, result) => {
    if (err) {
      return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
    }
    return res.render(`${path}/blog_plan`, { plan: result })
  })
})




// 2notice 글쓰기
router.route('/:id/notice/new').get((req, res) => {
  const subject_no = req.params.id

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/notice/`);
  }
  return res.render('professor/2notice/write', { subject_no: subject_no })
})
// 2notice 접속
router.route('/:id/notice').get((req, res) => {
  const subject_no = req.params.id

  service.listAllNotice(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/2notice/index', { subject_no: subject_no, board: result })
    }
    return res.render('professor/2notice/index', { subject_no: subject_no, board: result })
  })
})
// 2notice 게시글 읽기
router.route('/:id/notice/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readNotice(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/2notice/read', { subject_no: subject_no, board: result })
    }
    return res.render('professor/2notice/read', { subject_no: subject_no, board: result })
  })
})

// 2notice 글등록
router.route('/:id/notice/').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  if (req.session.userinfo[1] === Student) {
    return res.status(403).send('권한없음')
  }

  service.createNotice(req.body, (err, result) => {
    if (err) {
      return res.send(err)
    }
    return res.redirect(`/myclass/${subject_no}/notice`)
  })
})




// 3qna 글쓰기
router.route('/:id/qna/new').get((req, res) => {
  const subject_no = req.params.id
  
  return res.render('professor/3qna/write', { subject_no: subject_no })
})
// 3qna 접속
router.route('/:id/qna').get((req, res) => {
  const subject_no = req.params.id

  service.listAllQna(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/3qna/index', { subject_no: subject_no, board: result })
    }
    return res.render('professor/3qna/index', { subject_no: subject_no, board: result })
  })
})
// 3qna 게시글 읽기
router.route('/:id/qna/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readQna(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/3qna/read', { subject_no: subject_no, board: result })
    }
    return res.render('professor/3qna/read', { subject_no: subject_no, board: result })
  })
})
// 3qna 글등록
router.route('/:id/qna/').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  service.createQna(req.body, (err, result) => {
    if (err) {
      return res.send(err)
    }
    return res.redirect(`/myclass/${subject_no}/qna`)
  })
})




// 4ppt 글쓰기
router.route('/:id/ppt/new').get((req, res) => {
  const subject_no = req.params.id

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/ppt/`);
  }
  return res.render('professor/4ppt/write', { subject_no: subject_no })
})
// 4ppt 접속
router.route('/:id/ppt').get((req, res) => {
  const subject_no = req.params.id

  service.listAllPpt(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/4ppt/index', { subject_no: subject_no, board: result })
    }
    return res.render('professor/4ppt/index', { subject_no: subject_no, board: result })
  })
})
// 4ppt 게시글 읽기
router.route('/:id/ppt/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readPpt(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/4ppt/read', { subject_no: subject_no, board: result })
    }
    return res.render('professor/4ppt/read', { subject_no: subject_no, board: result })
  })
})
// 4ppt 글등록
router.route('/:id/ppt/').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  service.createPpt(req.body, (err, result) => {
    if (err) {
      return res.send(err)
    }
    return res.redirect(`/myclass/${subject_no}/ppt`)
  })
})


router.route('/:id/team').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/6team/blog_team', { subject_no: subject_no })

})

router.route('/:id/grade/').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/7grade/blog_grade', { subject_no: subject_no })

})


router.route('/:id/task/new').get((req, res) => {
  const subject_no = req.params.id

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/task/`);
  }
  return res.render('professor/5task/write', { subject_no: subject_no })
})

router.route('/:id/task/').get((req, res) => {
  const subject_no = req.params.id

  taskService.listAllTask(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAlltask Error\n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/5task/index', { subject_no: subject_no, board: result })
    }
    return res.render('professor/5task/index', { subject_no: subject_no, board: result })
  })
})

// 5task 게시글 읽기
router.route('/:id/task/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  taskService.readTask(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readTask Error\n ${err}`)
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/5task/read', { subject_no: subject_no, board: result })
    }
    return res.render('professor/5task/read', { subject_no: subject_no, board: result })
  })
})

// 5task 글등록
router.route('/:id/task').post(noticeFile.single('uploadFile'), (req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]
  if (req.file) {
    taskService.createFileTask(req.body,req.file, (err, result) => {
      if (err) {
        return res.send(err)
      }
      return res.redirect(`/myclass/${subject_no}/task`)
    })
  } else {

    taskService.createTask(req.body, (err, result) => {
      if (err) {
        return res.send(err)
      }
      return res.redirect(`/myclass/${subject_no}/task`)
    })
  }

})










module.exports = router;
