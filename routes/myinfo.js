const express = require('express')
    , router = express.Router()
    , models = require('../models');

router.all('*', (req, res, next) => {
    if (!req.session.userinfo) {
        return res.redirect('/login');
    }
    next('route')
})

router.route('/').get((req, res) => {

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