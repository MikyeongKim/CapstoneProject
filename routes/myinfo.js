const express = require('express')
    , router = express.Router()
    , models = require('../models');


router.route('/').get((req, res) => {


    if (!req.session.userinfo) {
        //todo : 잘못된 경로로 접근함.. 알림.
        return res.redirect('/login');
    }

    const user_no = req.session.userinfo[0];

    models.User.find({
        where: { user_no: user_no }
    }).then(result => {
        return res.render('student/myinfo', { userinfo: result });
    }).catch(function (err) {
        //TODO : status 오류코드 보내기
        return res.redirect('/')
    });
});



module.exports = router; 