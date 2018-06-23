const express = require('express')
  , router = express.Router()
  , classFunc = require('./service/myclassService')
  , models = require('../models')

const Student = 1
  , Professor = 2;

router.all('*', (req, res, next) => {
  req.session.userinfo= [1,1];
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

    classFunc.findClassByStu(userno, (err, result) => {
      if (err) {
        return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
      }
      return res.render('student/myclass', { myclass: result })
    })

  } else {
    classFunc.findClassByPro(userno, (err, result) => {
      if (err) {
        return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
      }
      return res.render('professor/myclass', { myclass: result })
    })
  }

})

router.route(['/main/:id', '/plan/:id']).get((req, res) => {
  const class_no = req.params.id

  const userGrade = req.session.userinfo[1];
  const userno = req.session.userinfo[0];

  let path = 'professor';
  if (userGrade === Student) {
    path = 'student'
  }

  classFunc.findPlanByAll(class_no, (err, result) => {
    if (err) {
      return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
    }
    return res.render(`${path}/blog_plan`, { plan: result })
  })
})


router.route('/notice/new').get((req, res) => {
  //return res.render('professor/notice/write.ejs')
  return res.render('professor/2notice/write')
})


router.route('/notice/:id').get((req, res) => {
  const class_no = req.params.id
  return res.render('professor/2notice/index')

})

router.route('/qna/new').get((req, res) => {
  return res.render('professor/3qna/write')

})


router.route('/qna/:id').get((req, res) => {
  const class_no = req.params.id
  return res.render('professor/3qna/index')
})

router.route('/ppt/new').get((req, res) => {

  return res.render('professor/4ppt/write')

})

router.route('/ppt/:id').get((req, res) => {
  const class_no = req.params.id
  return res.render('professor/4ppt/index')

})

router.route('/task/new').get((req, res) => {
  return res.render('professor/5task/write')
})

router.route('/task/:id').get((req, res) => {
  const class_no = req.params.id
  return res.render('professor/5task/index')
})

router.route('/team/:id').get((req, res) => {
  const class_no = req.params.id
  return res.render('student/blog_team')

})

router.route('/grade/:id').get((req, res) => {
  const class_no = req.params.id
  return res.render('student/blog_grade')

})


module.exports = router;