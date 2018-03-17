const express = require('express')
    , router = express.Router()
    , models = require('../models');


router.route('/').get((req, res) => {


    if (!req.session.userinfo) {
        //todo : 잘못된 경로로 접근함.. 알림.
        return res.redirect('/');
    }

    const user_no = req.session.userinfo[0];
    const user_grade = req.session.userinfo[1];

    if (user_grade == 1) {
        models.Student.find({
            where: { student_no: user_no }
        }).then(result => {
            res.render('common/myinfo', {
                name: result.student_name,
                phone: result.student_phone,
                email: result.student_email
            });
        })
    } else if (user_grade == 2) {
        models.Professor.find({
            where: { professor_no: user_no }
        }).then(result => {
            res.render('common/myinfo', {
                name: result.professor_name,
                phone: result.professor_phone,
                email: result.professor_email
            });
        })
    } else {
        models.Manager.find({
            where: { manager_no: user_no }
        }).then(result => {
            res.render('common/myinfo', {
                name: result.manager_name,
                phone: result.manager_phone,
                email: result.manager_email
            });
        })
    }
});



module.exports = router; 