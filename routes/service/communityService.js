const boardDAO = require('../Repository/Repo_board')
const comFunc = require('../func/comFunc')

module.exports = {
    listAllCommunity: listAllCommunity
    , createCommunity: createCommunity
    , readCommunity: readCommunity
    , readCommunityAuth: readCommunityAuth
    , updateCommunity: updateCommunity
    , deleteCommunity: deleteCommunity
    , updateFormCommunity: updateFormCommunity
}


function listAllCommunity(curPage, callback) {
    return boardDAO.listAllCommunity((err, result) => {
        if (err) {
            return callback(err)
        }
        result = comFunc.paging(curPage, result);
        return callback(null, result)
    })
}


function createCommunity(params, callback) {
    return boardDAO.createCommunity(params, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })

}

function readCommunity(board_no, callback) {
    return boardDAO.readCommunity(board_no, (err, result) => {
        if (err) {
            return callback(err)
        }

        if (result == false) {
            //return res.status(400).send('Bad Request')
            return callback(err)
        }
        return callback(null, result)
    })
}

function readCommunityAuth(board_no, user_no, callback) {
    return boardDAO.readCommunity(board_no, (err, result) => {
        if (err) {
            return callback(err)
        }

        if (result == false) {
            //return res.status(400).send('Bad Request')
            return callback(err)
        }
        comFunc.IsWriter(result.replyResult, user_no)

        if (result.boardResult.board_user_no == user_no) {
            result = {
                readBoard: result.boardResult,
                writer: true,
                reply: result.replyResult
            }
        } else {
            result = {
                readBoard: result.boardResult,
                writer: false,
                reply: result.replyResult
            }
        }
        return callback(null, result)
    })
}

function updateFormCommunity(board_no, user_no, callback) {
    boardDAO.findBoard(board_no, (err, result) => {
        if (err) {
            err.stats = '400';
            err.massage = 'bad request';
            return callback(err);
        }
        if (result.board_user_no != user_no) {
            // 악의적인 접근
            return callback(err);
        }

        return callback(null, result)
    })
}

function updateCommunity(body, board_no, user_no, callback) {
    boardDAO.findBoard(board_no, (err, result) => {
        if (err) {
            err.stats = '400';
            err.massage = 'bad request';
            return callback(err);
        }
        if (result.board_user_no != user_no) {
            // 악의적인 접근
            return callback(err);
        }

        boardDAO.updateCommunity(body, board_no, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}

function deleteCommunity(board_no, user_no, callback) {
    boardDAO.findBoard(board_no, (err, result) => {
        if (err) {
            err.stats = '400';
            err.massage = 'bad request';
            return callback(err);
        }
        if (result.board_user_no != user_no) {
            // 악의적인 접근
            return callback(err);
        }

        boardDAO.deleteCommunity(board_no, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}
