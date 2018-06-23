const express = require('express')
  , router = express.Router()
  , service = require('./service/myclassService')
  , models = require('../models')

const Student = 1
  , Professor = 2;

const NOTICE = 5
, QNA = 6
, PPT = 7
, TASK = 8;

// 게시글 읽을시 뒤로가기 수정하기 삭제하기 댓글 구현해야함
// 게시글 작성시 첨부파일 구현해야함
// 게시글 페이징처리 해야함
// 세션 끊겨 myclass접속시 오류페이지 처리해야함
// 접속, 읽기, 등록 과정 함수화 제대로

// 공지사항, 질의응답, 강의자료, 과제, 팀프로젝트 5개 게시판의 컬럼요소 상이
// 상이한 데이터일 경우 DB설계 추가로?
// 강의자료의 경우 공개기간 등
// 과제의 경우 제출방식, 마감일, 제출인원, 평균점수 등
// 팀프로젝트의 경우 제출방식, 마감일, 상태, 점수 등

// ㅎ이제자야지, 함수 중복없애려고 했는데 저건아닌거같다ㅋㅋ전문가의 손길이 필요

router.all('*', (req, res, next) => {
  /*
  req.session.userinfo = [1, 1];
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  }*/
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
  const userno = req.session.userinfo[0];

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

  return res.render('professor/2notice/write', { subject_no: subject_no })
})
// 2notice 접속
router.route('/:id/notice').get((req, res) => {
  let path = '2notice'

  listAllBlog(req, res, path, NOTICE)
})
// 2notice 게시글 읽기
router.route('/:id/notice/:no').get((req, res) => {
  let path = '2notice'

  readBlog(req, res, path)
})
// 2notice 글등록
router.route('/:id/notice/').post((req, res) => {
  let path = 'notice'

  createBlog(req, res, path, NOTICE)
})



// 3qna 글쓰기
router.route('/:id/qna/new').get((req, res) => {
  const subject_no = req.params.id

  return res.render('professor/3qna/write', { subject_no: subject_no })
})
// 3qna 접속
router.route('/:id/qna').get((req, res) => {
  let path = '3qna'

  listAllBlog(req, res, path, QNA)
})
// 3qna 게시글 읽기
router.route('/:id/qna/:no').get((req, res) => {
  let path = '3qna'

  readBlog(req, res, path)
})
// 3qna 글등록
router.route('/:id/qna/').post((req, res) => {
  let path = 'qna'

  createBlog(req, res, path, QNA)
})



// 4ppt 글쓰기
router.route('/:id/ppt/new').get((req, res) => {
  const subject_no = req.params.id

  return res.render('professor/4ppt/write', { subject_no: subject_no })
})
// 4ppt 접속
router.route('/:id/ppt').get((req, res) => {
  let path = '4ppt'

  listAllBlog(req, res, path, PPT)
})
// 4ppt 게시글 읽기
router.route('/:id/ppt/:no').get((req, res) => {
  let path = '4ppt'

  readBlog(req, res, path)
})
// 4ppt 글등록
router.route('/:id/ppt/').post((req, res) => {
  let path = 'ppt'

  createBlog(req, res, path, PPT)
})











router.route('/:id/task/new').get((req, res) => {
  const subject_no = req.params.id
  return res.render('professor/5task/write', { subject_no: subject_no })
})

router.route('/:id/task/').get((req, res) => {
  const subject_no = req.params.id
  return res.render('professor/5task/index', { subject_no: subject_no })
})

router.route('/:id/team').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/blog_team', { subject_no: subject_no })

})

router.route('/:id/grade/').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/blog_grade', { subject_no: subject_no })

})







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



module.exports = router;
