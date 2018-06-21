const boardDAO = require('../Repository/Repo_board')

module.exports = { 
    listAllCommunity : listAllCommunity
    , createCommunity: createCommunity
    , readCommunity : readCommunity
    ,
}


function listAllCommunity(callback) {
    return boardDAO.listAllCommunity(callback)
}


function createCommunity(params, callback) { 
    return boardDAO.createCommunity(params, callback)

}

function readCommunity(user_no,callback)  {
    return boardDAO.readCommunity(user_no, callback)
    
}

function readCommunityAuth(user_no,callback)  {
    return boardDAO.readCommunity(user_no, callback)
    
}