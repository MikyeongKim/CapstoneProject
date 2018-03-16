const express = require('express')
    , router = express.Router()
    , models = require('../models');


router.route('/').get((req, res) => {

    if (!req.session.userinfo) {
        models.sequelize.Promise.all([ 
            models.Board.findAll({
                where: { board_category: 1 },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            models.Board.findAll({
                where: { board_category: 2 },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            models.Board.findAll({
                where: { board_category: 3 },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
        ])
            .spread(function (returnNotice, returnFAQ, returnCommunity) { 
                return res.render('common/index', { notice: returnNotice, faq: returnFAQ, community: returnCommunity })
            }).catch(function (err) { 
                console.log(err);
            });


    } else {

        if (req.session.userinfo[1] === 1) {
            return res.render('student/index');
        } else {
            return res.render('professor/index');
        }
    }

});

router.route('/login')
    .get((req, res) =>
        res.render('common/login', { message: "" }))
    .post((req, res) => {
        const body = req.body;

        if (!(body.id && body.password)) {
            return res.render('common/login', { message: "아이디/패스워드를 입력해주세요." });
        }

        models.User.find({
            where: { user_id: body.id, user_password: body.password }
        }).then(result => {
            const grade = result.user_grade;
            req.session.userinfo = [body.id, grade];

            res.redirect('/');
        }).catch(err => {
            res.render('common/login', { message: '아이디/패스워드가 잘못되었습니다.' });
        });
    });


router.route('/logout').get((req, res) => {

    if (!req.session.userinfo) {
        //잘못된 경로로 접근하였습니다. 메세지 출력후 인덱스로 이동
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.clearCookie(`codit`);
            res.redirect('/');
        }
    });
});

router.route('/signup')
    .get((req, res) => res.render('common/signup'))
    .post((req, res) => {
        return models.sequelize.transaction(function (t) {
            const body = req.body;

            return models.User.create({
                user_id: body.id,
                user_password: body.password,
                user_grade: body.grade
            }, { transaction: t })
                .then(function (user) {
                    if (body.grade == 1) {

                        return models.Student.create({
                            student_id: body.id,
                            student_name: body.name,
                            student_email: body.email,
                            student_phone: body.phone,
                            department_id: body.department
                        }, { transaction: t });
                    } else {
                        return models.Professor.create({
                            professor_id: body.id,
                            professor_name: body.name,
                            professor_email: body.email,
                            professor_phone: body.phone,
                            department_id: body.department
                        }, { transaction: t });
                    }
                });
        }).then(function (result) {
            console.log("데이터 추가 완료");
            res.redirect('login');
        }).catch(function (err) {
            console.log("데이터 추가 실패");
        });
    })

module.exports = router;
