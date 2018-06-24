const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');

module.exports = {
    createTask: createTask        // 5task
    , listAllTask: listAllTask
    , readTask: readTask
    , createFileTask: createFileTask
}


function createTask(body, callback) {
    let submit_period = `${body.yymmdd} ${body.hhmm}`
    let time = new Date(submit_period)
    let time_sec = time.getSeconds()
    console.log(time)
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        myclassDAO.createTask(body, result.user_name, time, time_sec, (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}

function createFileTask(body,files, callback) {
    let submit_period = `${body.yymmdd} ${body.hhmm}`
    let time = new Date(submit_period)
    let time_sec = time.getSeconds()
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if (err) {
            return callback(err)
        }
        myclassDAO.createFileTask(body, result.user_name, time, time_sec,files ,(err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })
}


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
