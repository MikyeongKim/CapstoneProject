const boardDAO = require('../Repository/Repo_board')

module.exports = {
    listAllCommunity: listAllCommunity
    , createCommunity: createCommunity
    , readCommunity: readCommunity
    ,
}


function listAllCommunity(curPage,callback) {
    return boardDAO.listAllCommunity((err,result) => {
        if(err) {
           return callback(err)
        }
        result = paging(curPage,result);
        return callback(null,result)
    })
}


function createCommunity(params, callback) {
    return boardDAO.createCommunity(params, callback)

}

function readCommunity(user_no, callback) {
    return boardDAO.readCommunity(user_no, callback)

}

function readCommunityAuth(user_no, callback) {
    return boardDAO.readCommunity(user_no, callback)

}


function paging(currentPage , result) {

    if (currentPage == null) {
        currentPage = 1;
    }

    const limitList = 10;
    const limitPage = 10;
    let skipList = (currentPage - 1) * limitList;
    
    let startPage = Math.floor((currentPage - 1) / limitPage) * limitPage + 1;
    let endPage = startPage + limitPage - 1;
    let prevPage = startPage - limitPage
    let totalCount = result.length;
    let pageNum = Math.ceil(totalCount / limitList);
    
    if (endPage > pageNum) {
        endPage = pageNum
    }

    resultSet = result.slice(skipList, skipList + limitList)
    resultSet.skip = skipList
    resultSet.startp = startPage
    resultSet.endp = endPage
    resultSet.lastp = pageNum
    resultSet.prevp = prevPage

    return resultSet
}