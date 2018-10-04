const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');
const submitDAO = require('../Repository/Repo_task_submit');
const editFunc = require('../func/editfunc');

module.exports = {
  findClassByStu,
  findClassByPro,
  findPlanByAll,
  createNotice, // 2notice
  listAllNotice,
  readNotice,
  createQna, // 3qna
  listAllQna,
  readQna,
  createPpt, // 4ppt
  listAllPpt,
  readPpt,
  readCode
};

function findClassByStu(userno, callback) {
  myclassDAO.findClassByStu(userno, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}
function findClassByPro(userno, callback) {
  myclassDAO.findClassByPro(userno, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}
function findPlanByAll(subject_no, callback) {
  myclassDAO.findPlanByAll(subject_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

// notice 글작성
function createNotice(body, callback) {
  userDAO.findUserNameByNo(body.user_no, (err, result) => {
    if (err) {
      return callback(err);
    }

    myclassDAO.createNotice(body, result.user_name, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  });
}
// notice 게시글찾기
function listAllNotice(subject_no, callback) {
  myclassDAO.findAllNotice(subject_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}
// notice 글읽기
function readNotice(subject_no, blog_no, callback) {
  myclassDAO.readNotice(subject_no, blog_no, (err, result) => {
    if (err) {
      return callback(err);
    }

    return callback(null, result);
  });
}

// qna 글작성
function createQna(body, callback) {
  userDAO.findUserNameByNo(body.user_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    myclassDAO.createQna(body, result.user_name, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  });
}
// qna 게시글찾기
function listAllQna(subject_no, callback) {
  myclassDAO.findAllQna(subject_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}
// qna 글읽기
function readQna(subject_no, blog_no, callback) {
  myclassDAO.readQna(subject_no, blog_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

// ppt 글작성
function createPpt(body, callback) {
  userDAO.findUserNameByNo(body.user_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    myclassDAO.createPpt(body, result.user_name, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  });
}
// ppt 게시글찾기
function listAllPpt(subject_no, callback) {
  myclassDAO.findAllPpt(subject_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}
// ppt 글읽기
function readPpt(subject_no, blog_no, callback) {
  myclassDAO.readPpt(subject_no, blog_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

function readCode(path, submit_no, cb) {
  submitDAO.findUserBySubNo(submit_no, (err, userInfo) => {
    if (err) {
      return cb(err);
    }

    editFunc.readCode(path, (err, code) => {
      if (err) {
        return cb(err);
      }
      let resultVal = { userInfo: userInfo, code: code };
      cb(null, resultVal);
    });
  });
}
