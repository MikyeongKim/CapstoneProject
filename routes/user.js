const express = require('express')
    , router = express.Router()
    , models = require('../models');


router.route('/').get((req, res) => {


    if (!req.session.userinfo) {
        //todo : 잘못된 경로로 접근함.. 알림.
        return res.redirect('/');
    }

    const userid = req.session.userinfo[0];
    const usergrade = req.session.userinfo[1];

    if (usergrade === 1) {
        models.Student.find({
            where: { student_id: userid }
        }).then(result => {
            res.render('common/myinfo', {
                name: result.student_name,
                phone: result.student_phone,
                email: result.student_email
            });
        }).catch(err => {
            res.send(`${err}`);
            //res.redirect('/login');
            //res.send("<html><body><script>alert('아이디나 비밀번호를 확인해주세요');</script></body>");
        });
    } else {
        models.Professor.find({
            where: { professor_id: userid }
        }).then(result => {
            res.render('common/myinfo', {
                name: result.professor_name,
                phone: result.professor_phone,
                email: result.professor_email
            });
        }).catch(err => {
            res.send(`${err}`);
            //res.redirect('/login');
            //res.send("<html><body><script>alert('아이디나 비밀번호를 확인해주세요');</script></body>");
        });
    }

});



module.exports = router; 