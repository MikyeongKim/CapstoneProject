const express = require('express');
const router = express.Router();
const service = require('./service/myclassService');
const taskService = require('./service/taskService');
const multer = require('multer');

const _notice_storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/task');
  },
  filename: function(req, file, cb) {
    cb(null, `${req.session.userinfo[0]}-${Date.now()}-${file.originalname}`);
  }
});

const _submit_storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/submit');
  },
  filename: function(req, file, cb) {
    cb(null, `${req.session.userinfo[0]}-${Date.now()}-${file.originalname}`);
  }
});

const noticeFile = multer({ storage: _notice_storage });
const submitFile = multer({ storage: _submit_storage });

const Student = 1;
const Professor = 2;

router.all('*', (req, res, next) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login');
  }
  next('route');
});

router.route('/').get(service.findClass);

router.route(['/:id/main/', '/:id/plan/']).get(service.showPlan);

router.route('/:id/notice/new').get(service.createNoticeForm);
router.route('/:id/notice').get(service.listAllNotice);
router.route('/:id/notice/:no').get(service.readNotice);
router.route('/:id/notice/').post(service.createNotice);

router.route('/:id/qna/new').get(service.createQnaForm);
router.route('/:id/qna').get(service.listAllQna);
router.route('/:id/qna/:no').get(service.readQna);
router.route('/:id/qna/').post(service.createQna);

router.route('/:id/ppt/new').get((req, res) => {
  const subject_no = req.params.id;

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/ppt/`);
  }
  return res.render('professor/4ppt/write', { subject_no: subject_no });
});

router.route('/:id/ppt').get((req, res) => {
  const subject_no = req.params.id;

  service.listAllPpt(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`);
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/4ppt/index', {
        subject_no: subject_no,
        board: result
      });
    }
    return res.render('professor/4ppt/index', {
      subject_no: subject_no,
      board: result
    });
  });
});

router.route('/:id/ppt/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readPpt(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`);
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/4ppt/read', {
        subject_no: subject_no,
        board: result
      });
    }
    return res.render('professor/4ppt/read', {
      subject_no: subject_no,
      board: result
    });
  });
});

router.route('/:id/ppt/').post((req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no;
  req.body.user_no = req.session.userinfo[0];

  service.createPpt(req.body, (err, result) => {
    if (err) {
      return res.send(err);
    }
    return res.redirect(`/myclass/${subject_no}/ppt`);
  });
});

router.route('/:id/task/new').get((req, res) => {
  const subject_no = req.params.id;

  if (req.session.userinfo[1] === Student) {
    return res.redirect(`/myclass/${subject_no}/task/`);
  }
  return res.render('professor/5task/write', { subject_no: subject_no });
});

router.route('/:id/task/').get((req, res) => {
  const subject_no = req.params.id;

  taskService.listAllTask(subject_no, (err, result) => {
    if (err) {
      return res.send(`listAlltask Error\n ${err}`);
    }
    if (req.session.userinfo[1] === Student) {
      return res.render('student/5task/index', {
        subject_no: subject_no,
        board: result
      });
    }
    return res.render('professor/5task/index', {
      subject_no: subject_no,
      board: result
    });
  });
});

router.route('/:id/task/submit').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  return res.render('student/5task/task_write');
});

router.route('/:id/task/:no').get((req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;
  const user_no = req.session.userinfo[0];

  if (req.session.userinfo[1] === Student) {
    taskService.readTaskStu(user_no, blog_no, (err, result) => {
      if (err) {
        return res.send(`readTask Error\n ${err}`);
      }
      let isSubmit = result.taskResult == null ? false : true;
      return res.status(200).render('student/5task/read', {
        subject_no: subject_no,
        board: result.blogResult,
        task: result.taskResult,
        isSubmit: isSubmit
      });
    });
  } else {
    taskService.readTaskPro(blog_no, (err, result) => {
      if (err) {
        return res.send(`readTask Error\n ${err}`);
      }

      return res.status(200).render('professor/5task/read', {
        subject_no: subject_no,
        board: result.blogResult,
        task: result.taskResult
      });
    });
  }
});

// 5task 글등록
// router.route('/:id/task').post(noticeFile.array('uploadFile', 5), (req, res) => {
// req.files의 형태로 다수의 파일을 저장
router.route('/:id/task').post(noticeFile.single('uploadFile'), (req, res) => {
  let subject_no = req.params.id;
  req.body.subject_no = subject_no;
  req.body.user_no = req.session.userinfo[0];

  if (req.file) {
    taskService.createFileTask(req.body, req.file, (err, result) => {
      console.log('createFileTask 여기로 접속! 111');
      if (err) {
        return res.send(err);
      }
      return res.redirect(`/myclass/${subject_no}/task`);
    });
  } else {
    taskService.createTask(req.body, (err, result) => {
      console.log('createTask 여기로 접속! 222');
      if (err) {
        return res.send(err);
      }
      return res.redirect(`/myclass/${subject_no}/task`);
    });
  }
});

router.route('/:id/task/:no').post(submitFile.single('uploadFile'), (req, res) => {
  const subject_no = req.params.id;
  const blog_no = req.params.no;
  req.body.user_no = req.session.userinfo[0];
  if (req.file) {
    taskService.taskSubmitFile(req.body, blog_no, req.file, (err, result) => {
      if (err) {
        return res.send(err);
      }
      return res.redirect(`/myclass/${subject_no}/task/${blog_no}`);
    });
  } else {
    taskService.taskSubmit(req.body, blog_no, (err, result) => {
      if (err) {
        return res.send(err);
      }
      return res.redirect(`/myclass/${subject_no}/task/${blog_no}`);
    });
  }
});

router.route('/:subject/task/:blog_no/editor/:lang&:filename&:submit_no').get((req, res) => {
  const subject_no = req.params.subject;
  const blog_no = req.params.blog_no;
  const lang = req.params.lang;
  const filename = req.params.filename;
  const submit_no = req.params.submit_no;

  let filePath = `${__dirname}/../uploads/submit/${filename}`;

  service.readCode(filePath, submit_no, (err, result) => {
    if (err) {
      return res.send(err);
    }
    result.lang = lang;
    result.readcode = false;
    return res.render('professor/editor', { info: result });
  });
});

router.route('/:id/task/delete/:blog_no&:submit_no').get((req, res) => {
  const subject_no = req.params.id;
  const submit_no = req.params.submit_no;
  const blog_no = req.params.blog_no;
  const user_no = req.session.userinfo[0];

  taskService.delTaskSubmit(submit_no, (err, result) => {
    if (err) {
      return res.send(err);
    }
    return res.redirect(`/myclass/${subject_no}/task/${blog_no}`);
  });
});

router.route('/:id/team').get((req, res) => {
  const subject_no = req.params.id;
  return res.render('student/6team/blog_team', { subject_no: subject_no });
});

router.route('/:id/grade/').get((req, res) => {
  const subject_no = req.params.id;
  return res.render('student/7grade/blog_grade', { subject_no: subject_no });
});

router.route('/score/save').post((req, res) => {
  console.log(req.body);

  taskService.saveScorebyTask(req.body.task_no, req.body.score, (err, result) => {
    if (err) {
      return res.status(401).json({ massage: '실패했습니다.' });
    }
    return res.send({ result: true, content: result });
  });
});

module.exports = router;
