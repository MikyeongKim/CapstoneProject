const express = require('express')
    , router = express.Router()
    , models = require('../models');

const board_notice = 1
    , board_faq = 2
    , board_community = 3

const student = 1
    , professor = 2
    , manager = 3

router.route('/').get((req, res) => {

    if (!req.session.userinfo) {
        models.sequelize.Promise.all([
            models.Board.findAll({
                where: { board_category: board_notice },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            models.Board.findAll({
                where: { board_category: board_faq },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            models.Board.findAll({
                where: { board_category: board_community },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
        ])
            .spread((returnNotice, returnFAQ, returnCommunity) => {
                return res.render('common/index', { notice: returnNotice, faq: returnFAQ, community: returnCommunity })
            }).catch(function (err) {
                //TODO : status 오류코드 보내기
                return res.redirect('/')
            });

    } else {
        // 위에 조기리턴인데..!! else 지워면 왜 오류나는지 모르겠음.. ㅠ_ㅠ
        if (req.session.userinfo[1] === student ) {
            return res.render('student/index');
        } else {
            return res.render('professor/index');
        }
    }

});

router.route('/login')
    .get((req, res) => {

        res.render('common/login', { message: "" });
    })
    .post((req, res) => {

        const body = req.body;

        if (!(body.id && body.password)) {
            return res.render('common/login', { message: "아이디/패스워드를 입력해주세요." });
        }

        models.User.find({
            where: { user_id: body.id, user_password: body.password }
        }).then(result => {
            req.session.userinfo = [result.user_no, result.usergrade_no];
            res.redirect('/');
        }).catch(err => {
            res.render('common/login', { message: '아이디/패스워드가 잘못되었습니다.' });
        });
    });


router.route('/logout').get((req, res) => {

    if (!req.session.userinfo) {
        //TODO : 잘못된 경로로 접근하였습니다. 메세지 출력후 인덱스로 이동
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
        return models.sequelize.transaction((t) => {
            const body = req.body;

            return models.User.create({
                user_id: body.id,
                user_password: body.password,
                usergrade_no: body.grade
            }, { transaction: t })
                .then((result) => {
                    if (body.grade == student) {

                        return models.Student.create({
                            student_no: result.user_no,
                            student_name: body.name,
                            student_email: body.email,
                            student_phone: body.phone,
                            department_no: body.department
                        }, { transaction: t });
                    } else if (body.grade == professor) {

                        return models.Professor.create({
                            professor_no: result.user_no,
                            professor_name: body.name,
                            professor_email: body.email,
                            professor_phone: body.phone,
                            department_no: body.department
                        }, { transaction: t });
                    } else {

                        return models.Manager.create({
                            manager_no: result.user_no,
                            manager_name: body.name,
                            manager_email: body.email,
                            manager_phone: body.phone,
                            department_no: body.department
                        }, { transaction: t });
                    }
                }).then((result) => {
                    res.redirect('login');
                }).catch((err) => {
                    //TODO : 회원가입 실패 처리
                    console.log("데이터 추가 실패");
                });
        })
    })
module.exports = router;
