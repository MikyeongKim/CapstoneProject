const express = require('express')
  , router = express.Router()
  , service = require('./service/myclassService')
  , models = require('../models')

const Student = 1
  , Professor = 2;

router.all('*', (req, res, next) => {
  req.session.userinfo = [6, 2];
  /*
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


router.route('/:id/notice/new').get((req, res) => {
  const subject_no = req.params.id
  //return res.render('professor/notice/write.ejs')
  return res.render('professor/2notice/write', { subject_no: subject_no })
})


router.route('/:id/notice').get((req, res) => {
  const subject_no = req.params.id
  service.listAllNotice(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`)
    }
    return res.render('professor/2notice/index', { subject_no: subject_no, board: result })
  })
})

router.route('/:id/notice/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readNotice(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`)
    }
    return res.render('professor/2notice/read', { subject_no: subject_no , board: result})
  })

})

router.route('/:id/notice/').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]
  console.log(req.body.ispublic);

  service.createNotice(req.body, (err, result) => {
    if (err) {
      return res.send(err)
    }

    return res.redirect(`/myclass/${subject_no}/notice`)
  })
  //return res.render('professor/2notice/index' , {subject_no:subject_no})
})

router.route('/:id/task/new').get((req, res) => {
  const subject_no = req.params.id
  return res.render('professor/5task/write', { subject_no: subject_no })
})

router.route('/:id/task/').get((req, res) => {
  const subject_no = req.params.id
  return res.render('professor/5task/index', { subject_no: subject_no })
})

router.route('/:id/task/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  return res.render('professor/5task/read', { subject_no: subject_no })
})


router.route('/:id/task/').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  service.createNotice(req.body, (err, result) => {
    if (err) {
      return res.send(err)
    }

    return res.redirect(`/myclass/${subject_no}/notice`)
  })
  //return res.render('professor/2notice/index' , {subject_no:subject_no})
})




router.route('/:id/qna/new').get((req, res) => {
  return res.render('professor/3qna/write')

})


router.route('/:id/qna').get((req, res) => {
  const subject_no = req.params.id
  return res.render('professor/3qna/index', { subject_no: subject_no })
})

router.route('/:id/ppt/new').get((req, res) => {

  return res.render('professor/4ppt/write', { subject_no: subject_no })

})

router.route('/:id/ppt').get((req, res) => {
  const subject_no = req.params.id
  return res.render('professor/4ppt/index', { subject_no: subject_no })

})

router.route('/:id/team').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/blog_team', { subject_no: subject_no })

})

router.route('/:id/grade/').get((req, res) => {
  const subject_no = req.params.id
  return res.render('student/blog_grade', { subject_no: subject_no })

})


module.exports = router;
