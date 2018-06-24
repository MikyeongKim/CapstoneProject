const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');

module.exports = {
    findClassByStu: findClassByStu
    , findClassByPro: findClassByPro
    , findPlanByAll: findPlanByAll
    , createNotice: createNotice    // 2notice
    , listAllNotice: listAllNotice
    , readNotice: readNotice
    , createQna: createQna          // 3qna
    , listAllQna: listAllQna
    , readQna: readQna
    , createPpt: createPpt          // 4ppt
    , listAllPpt: listAllPpt
    , readPpt: readPpt
    , createTask: createTask        // 5task
    , listAllTask: listAllTask
    , readTask: readTask
}

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





// notice 글작성
function createNotice(body, callback) {
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }

        myclassDAO.createNotice(body, result.user_name, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}
// notice 게시글찾기
function listAllNotice(subject_no, callback) {
    myclassDAO.findAllNotice(subject_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
// notice 글읽기
function readNotice(subject_no, blog_no, callback) {
    myclassDAO.readNotice(subject_no,blog_no,(err,result) => {
        if(err) {
            return callback(err)
        }

        return callback(null,result)
    })
}




// qna 글작성
function createQna(body, callback) {
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        myclassDAO.createQna(body, result.user_name, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}
// qna 게시글찾기
function listAllQna(subject_no, callback) {
    myclassDAO.findAllQna(subject_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
// qna 글읽기
function readQna(subject_no, blog_no, callback) {
    myclassDAO.readQna(subject_no,blog_no,(err,result) => {
        if(err) {
            return callback(err)
        }
        return callback(null,result)
    })
}




// ppt 글작성
function createPpt(body, callback) {
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        myclassDAO.createPpt(body, result.user_name, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}
// ppt 게시글찾기
function listAllPpt(subject_no, callback) {
    myclassDAO.findAllPpt(subject_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
// ppt 글읽기
function readPpt(subject_no, blog_no, callback) {
    myclassDAO.readPpt(subject_no,blog_no,(err,result) => {
        if(err) {
            return callback(err)
        }
        return callback(null,result)
    })
}




// task 글작성
function createTask(body, callback) {
    let submit_period = `${body.yymmdd} ${body.hhmm}`
    let time = new Date(submit_period)
    console.log(time)
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        myclassDAO.createTask(body, result.user_name, time, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}
// task 게시글찾기
function listAllTask(subject_no, callback) {
    myclassDAO.findAllTask(subject_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
// task 글읽기
function readTask(subject_no, blog_no, callback) {
    myclassDAO.readTask(subject_no, blog_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}
