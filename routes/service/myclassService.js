const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');
const submitDAO = require('../Repository/Repo_task_submit');
const editFunc = require('../func/editfunc');

const STUDENT = 1;
const PROFESSOR = 2;

findClass = async (req, res, next) => {
  const userGrade = req.session.userinfo[1];
  const userNo = req.session.userinfo[0];
  let result;
  try {
    result =
      userGrade === STUDENT
        ? await myclassDAO.findClassByStu(userNo)
        : await myclassDAO.findClassByPro(userNo);
  } catch (e) {
    return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
  }

  return userGrade === STUDENT
    ? res.render('student/myclass', { myclass: result[0].subjects })
    : res.render('professor/myclass', { myclass: result });
};

showPlan = async (req, res, next) => {
  const subject_no = req.params.id;
  const userGrade = req.session.userinfo[1];
  const path = userGrade === STUDENT ? 'student' : 'professor';
  let result;
  try {
    result = await myclassDAO.findPlanByAll(subject_no);
  } catch (e) {
    return res.send('Myclass error 이것좀 작업해 종화야 에러처리 등록해라.!');
  }

  return res.render(`${path}/blog_plan`, {
    subject_no: result[0].subject_no,
    plan: result[0]
  });
};

createNoticeForm = (req, res, next) => {
  const subject_no = req.params.id;

  if (req.session.userinfo[1] === STUDENT) {
    return res.redirect(`/myclass/${subject_no}/notice/`);
  }
  return res.render('professor/2notice/write', { subject_no: subject_no });
};

createQnaForm = (req, res, next) => {
  const subject_no = req.params.id;
  return res.render('professor/3qna/write', { subject_no: subject_no });
};

createNotice = async (req, res, next) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no;
  req.body.user_no = req.session.userinfo[0];

  if (req.session.userinfo[1] === STUDENT) {
    return res.status(403).send('forbidden');
  }

  let result;
  try {
    result = await userDAO.findUserNameByNo(req.body.user_no);
  } catch (e) {
    return res.status(500).send('createNotice findUser error');
  }

  if (!result) return res.status(404).send('404');

  try {
    await myclassDAO.createNotice(req.body, result.user_name);
  } catch (e) {
    return res.status(500).send('createNotice error');
  }
  return res.redirect(`/myclass/${subject_no}/notice`);
};

// notice 게시글찾기
listAllNotice = async (req, res, next) => {
  const subject_no = req.params.id;
  const userGrade = req.session.userinfo[1];
  let result;
  try {
    result = await myclassDAO.findAllNotice(subject_no);
  } catch (e) {
    return res.send(`listAllNotice Error`);
  }

  const path = userGrade === STUDENT ? 'student/2notice/index' : 'professor/2notice/index';
  return res.render(path, { subject_no: subject_no, board: result });
};

readNotice = async (req, res, next) => {
  const subjectNo = req.params.id;
  const blogNo = req.params.no;
  let result;
  try {
    result = await myclassDAO.readNotice(subjectNo, blogNo);
  } catch (e) {
    return res.send('readNotice error');
  }
  let path =
    req.session.userinfo[1] === STUDENT ? 'student/2notice/read' : 'professor/2notice/read';

  return res.render(path, {
    subject_no: subjectNo,
    board: result
  });
};

createQna = async (req, res, next) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no;
  req.body.user_no = req.session.userinfo[0];
  let result;
  try {
    result = await userDAO.findUserNameByNo(req.body.user_no);
  } catch (e) {
    return res.status(500).send('createQna findUserNameByNo error');
  }

  try {
    await myclassDAO.createQna(req.body, result.user_name);
  } catch (e) {
    return res.status(500).send('createQna error');
  }

  return res.redirect(`/myclass/${subject_no}/qna`);
};

listAllQna = async (req, res, next) => {
  const subject_no = req.params.id;
  let result;
  try {
    result = await myclassDAO.findAllQna(subject_no);
  } catch (e) {
    return res.send('listAllNotice Error');
  }

  let path = req.session.userinfo[1] === STUDENT ? 'student/3qna/index' : 'professor/3qna/index';

  return res.render(path, {
    subject_no,
    board: result
  });
};

readQna = async (req, res, next) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;
  let result;
  try {
    result = await myclassDAO.readQna(subject_no, blog_no);
  } catch (e) {
    return res.send('readQna error');
  }
  const path = req.session.userinfo[1] === STUDENT ? 'student/3qna/read' : 'professor/3qna/read';

  return res.render(path, {
    subject_no: subject_no,
    board: result
  });
};

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

module.exports = {
  findClass,
  showPlan,
  createNotice,
  createNoticeForm,
  createQnaForm,
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
