const express = require('express')
    , router = express.Router()
    , models = require('../models');

router.route('/read/:id').get((req, res) => {
    const req_board_no = req.params.id

    models.sequelize.Promise.all([
        models.Board.find({
            where: { board_no: req_board_no }
        }),

        models.Board.update({
            board_count: models.sequelize.literal('board_count+1')
        }, { where: { board_no: req_board_no } })
    ])
        .spread((findResult, updateResult) => {

            if (!findResult) {
                return res.status(400).send("잘못된 경로로 접근했습니다.")
            }

            if (!req.session.userinfo) {
                return res.redirect('/login')
            }

            if (findResult.board_user_no == req.session.userinfo[0]) {
                return res.render('common/boardread', { readBoard: findResult, writer: true });
            }

            return res.render('common/boardread', { readBoard: findResult, writer: false });

        }).catch(function (err) {
            return res.status(503).send("503 Service Unavailable. Please try again in a few minutes.")
        });


});