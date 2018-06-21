const express = require('express')
  , router = express.Router()
  , classFunc = require('./func/classFunc')
  , models = require('../models')

const Student = 1
  , Professor = 2

router.route('/').get((req, res) => {

  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  }

  const userGrade = req.session.userinfo[1];
  const userno = req.session.userinfo[0];

  if (userGrade === Student) {

    classFunc.findClassByStu(userno, result => {
      return res.render('student/myclass', { myclass: result })
    })

  } else {
    classFunc.findClassByPro(userno, result => {
      return res.render('professor/myclass', { myclass: result })
    })
  }

})

router.route(['/main/:id', '/plan/:id']).get((req, res) => {
  const class_no = req.params.id

  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  }

  const userGrade = req.session.userinfo[1];
  const userno = req.session.userinfo[0];

  if (userGrade === Student) {
    classFunc.findPlanByAll(class_no, result => {
      return res.render('student/blog_plan', { plan: result })
    })
  } else {
    classFunc.findPlanByAll(class_no, result => {
      return res.render('professor/blog_plan', { plan: result })
    })
  }
})


router.route('/notice/:id').get((req, res) => {
    const class_no = req.params.id
    return res.render('professor/blog_notice')

  })




router.route('/qna/:id').get((req, res) => {
    const class_no = req.params.id
    return res.render('student/blog_qna')

  })

router.route('/ppt/:id').get((req, res) => {
    const class_no = req.params.id
    return res.render('student/blog_ppt')

  })

router.route('/task/:id').get((req, res) => {
    const class_no = req.params.id
    return res.render('student/blog_hw')

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