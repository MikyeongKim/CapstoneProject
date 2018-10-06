const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');
const submitDAO = require('../Repository/Repo_task_submit');
const editFunc = require('../func/editfunc');

const STUDENT = 1;

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

createPptForm = (req, res) => {
  const subject_no = req.params.id;
  if (req.session.userinfo[1] === STUDENT) {
    return res.redirect(`/myclass/${subject_no}/ppt/`);
  }
  return res.render('professor/4ppt/write', { subject_no: subject_no });
};

createTaskForm = (req, res) => {
  const subject_no = req.params.id;

  if (req.session.userinfo[1] === STUDENT) {
    return res.redirect(`/myclass/${subject_no}/task/`);
  }
  return res.render('professor/5task/write', { subject_no: subject_no });
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

listAllPpt = async (req, res, next) => {
  const subject_no = req.params.id;
  let result;
  try {
    result = await myclassDAO.findAllPpt(subject_no);
  } catch (e) {
    return res.send(`listAllNotice Error`);
  }

  const path = req.session.userinfo[1] === STUDENT ? 'student/4ppt/index' : 'professor/4ppt/index';

  return res.render(path, {
    subject_no: subject_no,
    board: result
  });
};

listAllTask = async (req, res, next) => {
  const subjectNo = req.params.id;
  let result;
  try {
    result = await myclassDAO.findAllTask(subjectNo);
  } catch (e) {
    return res.send('listAlltask Error');
  }

  const path =
    req.session.userinfo[1] === STUDENT ? 'student/5task/index' : 'professor/5task/index';

  return res.render(path, {
    subject_no: subjectNo,
    board: result
  });
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

readPpt = async (req, res, next) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  try {
    result = await myclassDAO.readPpt(subject_no, blog_no);
  } catch (e) {
    return res.send(`readPpt readPpt error \n ${err}`);
  }

  const path = req.session.userinfo[1] === STUDENT ? 'student/4ppt/read' : 'professor/4ppt/read';

  return res.render(path, {
    subject_no: subject_no,
    board: result
  });
};

readTask = async (req, res, next) => {
  const subjectNo = req.params.id;
  const blogNo = req.params.no;
  const userNo = req.session.userinfo[0];
  let blogResult, taskResult;
  let isStudent = req.session.userinfo[1] === STUDENT;
  try {
    [blogResult, taskResult] = isStudent
      ? await myclassDAO.readTaskStu(userNo, blogNo)
      : await myclassDAO.readTaskPro(blogNo);
    if (taskResult === null) {
      taskResult = await myclassDAO.readTaskFindOne(userNo, blogNo);
    }
  } catch (e) {
    return res.status(500).send('readTask readTaskStu error');
  }

  if (isStudent) {
    let isSubmit = taskResult === null ? false : true;
    return res.render('student/5task/read', {
      subject_no: subjectNo,
      board: blogResult,
      task: taskResult,
      isSubmit: isSubmit
    });
  }

  return res.render('professor/5task/read', {
    subject_no: subjectNo,
    board: blogResult,
    task: taskResult
  });
};

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

createPpt = async (req, res, next) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no;
  req.body.user_no = req.session.userinfo[0];
  let result;

  try {
    result = await userDAO.findUserNameByNo(req.body.user_no);
  } catch (e) {
    return res.status(500).send('createPpt findUserNameByNo error');
  }

  try {
    await myclassDAO.createPpt(req.body, result.user_name);
  } catch (e) {
    return res.status(500).send('createPpt createPpt error');
  }

  return res.redirect(`/myclass/${subject_no}/ppt`);
};

readCode = async (req, res, next) => {
  const subjectNo = req.params.subject;
  const blogNo = req.params.blog_no;
  const lang = req.params.lang;
  const filename = req.params.filename;
  const submitNo = req.params.submit_no;
  let filePath = `${__dirname}/../../uploads/submit/${filename}`;
  let result;
  try {
    let userInfo = await submitDAO.findUserBySubNo(submitNo);
    let code = await editFunc.readCode(filePath);
    result = { userInfo, code, lang, readcode: false };
  } catch (e) {
    return res.status(500).send('readCode error');
  }

  return res.render('professor/editor', { info: result });
};

taskSubmit = (req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  return res.render('student/5task/task_write');
};

taskSubmit2 = async (req, res, next) => {
  const subjectNo = req.params.id;
  const blogNo = req.params.no;
  req.body.user_no = req.session.userinfo[0];
  let extension;

  if (req.file) {
    let fileName = req.file.originalname;
    let pathFileName = fileName.lastIndexOf('.') + 1; //확장자 제외한 경로+파일명
    extension = fileName.substr(pathFileName, fileName.length).toLowerCase(); //확장자명
  }

  try {
    req.file
      ? await myclassDAO.taskSubmitFile(req.body, blogNo, req.file, extension)
      : await myclassDAO.taskSubmit(req.body, blogNo);
  } catch (e) {
    return res.status(500).send('taskSubmit2 taskSubmit error ');
  }

  return res.redirect(`/myclass/${subjectNo}/task/${blogNo}`);
};

createTask = async (req, res, next) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no;
  req.body.user_no = req.session.userinfo[0];

  let submit_period = `${req.body.yymmdd} ${req.body.hhmm}`;
  let time = new Date(submit_period);
  let time_sec = time.getSeconds();
  let result;

  try {
    result = await userDAO.findUserNameByNo(req.body.user_no);
  } catch (e) {
    return res.status(500).send('createFileTask findUserNameByNo error');
  }

  if (!result) return res.status(400).send('400 bad Request');

  try {
    req.file
      ? await myclassDAO.createFileTask(req.body, result.user_name, time, time_sec, req.file)
      : await myclassDAO.createTask(req.body, result.user_name, time, time_sec);
  } catch (e) {
    console.log(e);
    return res.status(500).send('createFileTask createFileTask error');
  }

  return res.redirect(`/myclass/${subject_no}/task`);
};

delTaskSubmit = async (req, res, next) => {
  const subject_no = req.params.id;
  const submit_no = req.params.submit_no;
  const blog_no = req.params.blog_no;
  const user_no = req.session.userinfo[0];

  try {
    await myclassDAO.delTaskSubmit(submit_no);
  } catch (e) {
    return res.status(500).send('delTaskSubmit error');
  }
  return res.redirect(`/myclass/${subject_no}/task/${blog_no}`);
};

module.exports = {
  createNoticeForm,
  createQnaForm,
  createPptForm,
  createTaskForm,
  listAllNotice,
  listAllQna,
  listAllPpt,
  listAllTask,
  findClass,
  showPlan,
  createNotice,
  createQna,
  createPpt,
  readNotice,
  readQna,
  readPpt,
  readCode,
  readTask,
  taskSubmit,
  createTask,
  taskSubmit2,
  delTaskSubmit
};
