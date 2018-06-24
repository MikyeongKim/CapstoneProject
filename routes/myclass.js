const express = require('express')
  , router = express.Router()
  , service = require('./service/myclassService')
  , models = require('../models')

const Student = 1
  , Professor = 2;



router.all('*', (req, res, next) => {
  if (!req.session.userinfo) {
    if (req.originalUrl === '/myclass') {
      return res.status(401).redirect('/login')
    }
    return res.status(401).json({ massage: '세션이 끊겼습니다.' });
  }
  next('route')
})



/*
-------------------------------------------------------------------------------
게시글 읽을시 뒤로가기 수정하기 삭제하기 댓글 구현해야함
게시글 작성시 첨부파일 구현해야함
게시글 페이징처리 해야함
세션 끊겨 myclass접속시 오류페이지 처리해야함
접속, 읽기, 등록 과정 함수화 제대로
종화가 분리하라함 서비스.~Blog >> 각자 함수로 분리, 카테고리 인자도 지우기
-------------------------------------------------------------------------------
공지사항, 질의응답, 강의자료, 과제, 팀프로젝트 5개 게시판의 컬럼요소 상이
상이한 데이터일 경우 DB설계 추가로?
강의자료의 경우 공개기간 등
과제의 경우 제출방식, 마감일, 제출인원, 평균점수 등
팀프로젝트의 경우 제출방식, 마감일, 상태, 점수 등

학생이 질의응답 글쓰는거 일단은 막아놈
지금은 오작 교수만이 글을쓸수있음
-------------------------------------------------------------------------------
*/


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

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/qna/`);
  }
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




// 5task 글쓰기
router.route('/:id/task/new').get((req, res) => {
  const subject_no = req.params.id

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/task/`);
  }
  return res.render('professor/5task/write', { subject_no: subject_no })
})
// 5task 접속
router.route('/:id/task/').get((req, res) => {
  const subject_no = req.params.id

  service.listAllTask(subject_no, (err, result) => {
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

  service.readTask(subject_no, blog_no, (err, result) => {
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
router.route('/:id/task').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  service.createTask(req.body, (err, result) => {
    if (err) {
      return res.send(err)
    }
    return res.redirect(`/myclass/${subject_no}/task`)
  })
})








router.route('/:id/team').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/blog_team', { subject_no: subject_no })

})

router.route('/:id/grade/').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/blog_grade', { subject_no: subject_no })

})






/*
function listAllBlog(req, res, path, category){
  const subject_no = req.params.id

  service.listAllBlog(subject_no, category, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`)
    }
    return res.render(`professor/${path}/index`, { subject_no: subject_no, board: result })
  })
}

function readBlog(req, res, path){
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readBlog(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`)
    }
    return res.render(`professor/${path}/read`, { subject_no: subject_no , board: result})
  })
}

function createBlog(req, res, path, category){
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  service.createBlog(req.body, category, (err, result) => {
    if (err) {
      return res.send(err)
    }
    return res.redirect(`/myclass/${subject_no}/${path}`)
  })
  //return res.render('professor/2notice/index' , {subject_no:subject_no})
}
*/

module.exports = router;
