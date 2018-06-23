const models = require('../../models');
module.exports = {
    listAllCommunity: listAllCommunity
    , createCommunity: createCommunity
    , readCommunity: readCommunity
    , findBoard: findBoard
    , updateCommunity: updateCommunity
    , deleteCommunity: deleteCommunity
}
const community_category = 3


function listAllCommunity(callback) {
    models.Board.findAll({
        where: {
            board_category: community_category
        },
        order: [
            ['created_at', 'DESC']
        ]
    }).then((result) => {
        return callback(null, result);
    }).catch(err => {
        return callback(err);
    })
}

function createCommunity(params, callback) {
    return models.sequelize.transaction((t) => {
        return models.User.find({
            where: {
                user_no: params.userno
            }
        }, {
                transaction: t
            })
            .then(user_result => {

                return models.Board.create({
                    board_category: community_category,
                    board_title: params.title,
                    board_content: params.content,
                    board_department: params.board_department,
                    board_user_no: user_result.user_no,
                    board_writer: user_result.user_name
                }, {
                        transaction: t
                    })
            }).then(result => {
                callback(null, result)
            }).catch(err => {
                callback(err)
            })
    })
}

function readCommunity(board_no, callback) {
    models.sequelize.Promise.all([
        models.Board.find({
            where: { board_no: board_no }
        }),
        models.Board.update({
            board_count: models.sequelize.literal('board_count+1')
        }, {
                where: { board_no: board_no }
            }),

        models.Reply.findAll({
            where: { board_no: board_no }
        })
    ]).spread((boardResult, updateResult, replyResult) => {
        let result = { boardResult: boardResult, updateResult: updateResult, replyResult: replyResult }
        if (!boardResult) {
            return callback(null, false)
        }
        return callback(null, result)
    }).catch((err) => {
        return callback(err)
    });
}

function findBoard(board_no, callback) {
    models.Board.find({
        where: {
            board_no: board_no
        }
    }).then(result => {
        if (!result) {
            return callback(err)
        }
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}

function updateCommunity(body, board_no, callback) {

    models.Board.update({
        board_title: body.title,
        board_content: body.content,
        board_department: body.board_department
    }, {
            where: { board_no: board_no }
        }).then(result => {
            callback(null, result)
        }).catch(err => {
            callback(err)
        })
}

function deleteCommunity(board_no, callback) {
    models.Board.destroy({
        where: {
            board_no: board_no
        }
    }).then(result => {
        callback(null, result)
    }).catch(err => {
        callback(err)
    })
}