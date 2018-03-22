const express = require('express')
    , router = express.Router()
    , models = require('../models');


router.route('/').get((req, res) => {


    if (!req.session.userinfo) {
        //todo : 잘못된 경로로 접근함.. 알림.
        return res.redirect('/');
    }

    const user_no = req.session.userinfo[0];

    models.User.find({
        where: { user_no: user_no }
    }).then(result => {
        res.render('common/myinfo', {
            name: result.user_name,
            phone: result.user_phone,
            email: result.user_email
        });
    })
});



module.exports = router; 