const myclassDAO = require('../Repository/Repo_myclass');
const userDAO = require('../Repository/Repo_user');
const taskDAO = require('../Repository/Repo_task');
const submitDAO = require('../Repository/Repo_task_submit');

module.exports = {
  createTask, // 5task
  listAllTask,
  readTaskPro,
  readTaskStu,
  createFileTask,
  taskSubmit,
  taskSubmitFile,
  delTaskSubmit,
  saveScorebyTask
};

function createTask(body, callback) {
  let submit_period = `${body.yymmdd} ${body.hhmm}`;
  let time = new Date(submit_period);
  let time_sec = time.getSeconds();
  console.log(time);
  userDAO.findUserNameByNo(body.user_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    taskDAO.createTask(
      body,
      result.user_name,
      time,
      time_sec,
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  });
}

function createFileTask(body, files, callback) {
  let submit_period = `${body.yymmdd} ${body.hhmm}`;
  let time = new Date(submit_period);
  let time_sec = time.getSeconds();

  userDAO.findUserNameByNo(body.user_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    taskDAO.createFileTask(
      body,
      result.user_name,
      time,
      time_sec,
      files,
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  });
}

function listAllTask(subject_no, callback) {
  taskDAO.findAllTask(subject_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}
// task 글읽기
function readTaskPro(blog_no, callback) {
  taskDAO.readTaskPro(blog_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

function readTaskStu(user_no, blog_no, callback) {
  taskDAO.readTaskStu(user_no, blog_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

function taskSubmit(body, blog_no, callback) {
  taskDAO.taskSubmit(body, blog_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

function taskSubmitFile(body, blog_no, files, callback) {
  let fileName = files.originalname;
  let pathFileName = fileName.lastIndexOf('.') + 1; //확장자 제외한 경로+파일명
  let extension = fileName.substr(pathFileName, fileName.length).toLowerCase(); //확장자명
  let lang = 0;
  if (extension == 'c') {
    lang = 'c';
  } else if (extension == 'java') {
    lang = 'java';
  } else if (extension == 'py') {
    lang = 'py';
  }

  taskDAO.taskSubmitFile(body, blog_no, files, lang, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

function delTaskSubmit(submit_no, callback) {
  taskDAO.delTaskSubmit(submit_no, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
}

function saveScorebyTask(task_no, score, cb) {
  submitDAO.saveScorebyTask(task_no, score, (err, result) => {
    if (err) {
      return cb(err);
    }
    return cb(null, result);
  });
}
