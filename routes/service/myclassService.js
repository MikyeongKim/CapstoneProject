const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');

module.exports = {
    findClassByStu: findClassByStu
    , findClassByPro: findClassByPro
    , findPlanByAll: findPlanByAll
    , createBlog: createBlog
    , listAllBlog: listAllBlog
    , readBlog: readBlog
}

// 니넨 붙어있어라
function findClassByStu(userno, callback) {
    myclassDAO.findClassByStu(userno, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
function findClassByPro(userno, callback) {

    myclassDAO.findClassByPro(userno, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
function findPlanByAll(subject_no, callback) {
    myclassDAO.findPlanByAll(subject_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}





// notice,qna 글작성
function createBlog(body, category, callback) {
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }

        myclassDAO.createBlog(body, result.user_name, category, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}
// notice,qna 게시글찾기
function listAllBlog(subject_no, category, callback) {
    myclassDAO.findAllBlog(subject_no, category, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
// notice,qna 글읽기
function readBlog(subject_no, blog_no, callback) {
    myclassDAO.readBlog(subject_no,blog_no,(err,result) => {
        if(err) {
            return callback(err)
        }

        return callback(null,result)
    })
}
