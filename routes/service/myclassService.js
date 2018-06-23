const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');

module.exports = {
    findClassByStu: findClassByStu
    , findClassByPro: findClassByPro
    , findPlanByAll: findPlanByAll
    , createNotice: createNotice
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


function createNotice(body, callback) {
    userDAO.findUserNameByNo(body.user_no, (err, result) => {
        if(err) {
            return callback(err)
        }

        myclassDAO.createNotice(body, result.user_name ,(err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
    })

}
