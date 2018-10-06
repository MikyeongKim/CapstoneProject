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

router.route('/:id/ppt/new').get(service.createPptForm);
router.route('/:id/ppt').get(service.listAllPpt);
router.route('/:id/ppt/:no').get(service.readPpt);
router.route('/:id/ppt/').post(service.createPpt);

router.route('/:id/task/new').get(service.createTaskForm);
router.route('/:id/task/').get(service.listAllTask);
router.route('/:id/task/submit').get(service.taskSubmit);
router.route('/:id/task/:no').get(service.readTask);
router.route('/:id/task').post(noticeFile.single('uploadFile'), service.createTask);

router.route('/:id/task/:no').post(submitFile.single('uploadFile'), service.taskSubmit2);

router.route('/:subject/task/:blog_no/editor/:lang&:filename&:submit_no').get(service.readCode);

router.route('/:id/task/delete/:blog_no&:submit_no').get(service.delTaskSubmit);

router.route('/:id/team').get((req, res) => {
  const subject_no = req.params.id;
  return res.render('student/6team/blog_team', { subject_no: subject_no });
});

router.route('/:id/grade/').get((req, res) => {
  const subject_no = req.params.id;
  return res.render('student/7grade/blog_grade', { subject_no: subject_no });
});

router.route('/score/save').post((req, res) => {
  taskService.saveScorebyTask(req.body.task_no, req.body.score, (err, result) => {
    if (err) {
      return res.status(401).json({ massage: '실패했습니다.' });
    }
    return res.send({ result: true, content: result });
  });
});

module.exports = router;
