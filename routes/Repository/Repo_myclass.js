const models = require('../../models');

const NOTICE = 5,
  QNA = 6,
  PPT = 7,
  TASK = 8;

module.exports = {
  findClassByStu,
  findClassByPro,
  findPlanByAll,
  createNotice, // 2notice
  findAllNotice,
  readNotice,
  createQna, // 3qna
  findAllQna,
  readQna,
  createPpt, // 4ppt
  findAllPpt,
  readPpt
};

function findClassByStu(userno, callback) {
  models.Student.findAll({
    where: { student_no: userno },
    attributes: [],
    limit: 1,
    include: [
      {
        model: models.subject,
        attributes: [
          'subject_no',
          'subject_name',
          'subject_place',
          'subject_credit',
          'subject_time',
          'sub_pro_name'
        ],
        through: {
          attributes: []
        }
      }
    ]
  })
    .then(result => {
      callback(null, result[0]['subjects']);
    })
    .catch(err => {
      callback(err);
    });
}
function findClassByPro(userno, callback) {
  models.subject
    .findAll({
      where: { professor_no: userno }
    })
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      callback(err);
    });
}
function findPlanByAll(subject_no, callback) {
  models.subject
    .findAll({
      where: { subject_no: subject_no },
      include: [
        {
          model: models.subjectType,
          attributes: ['subjectType_name']
        },
        {
          model: models.Department,
          attributes: ['department_name']
        }
      ]
    })
    .then(result => {
      callback(null, result[0]);
    })
    .catch(err => {
      callback(err);
    });
}

// notice 글작성
function createNotice(body, user_name, callback) {
  models.blog
    .create({
      blog_title: body.title,
      blog_content: body.content,
      blog_writer: user_name,
      blog_ispublic: body.ispublic,
      blog_user_no: body.user_no,
      blog_category: NOTICE,
      subject_no: body.subject_no
    })
    .then(result => {
      return callback(null, true);
    })
    .catch(err => {
      return callback(err);
    });
}
// notice 게시글나열
function findAllNotice(subject_no, callback) {
  models.blog
    .findAll({
      where: {
        blog_category: NOTICE,
        subject_no: subject_no
      },
      //limit: 5,
      order: [['created_at', 'DESC']]
    })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}
// notice 글읽기
function readNotice(subject_no, blog_no, callback) {
  models.blog
    .find({
      where: {
        blog_no: blog_no,
        subject_no: subject_no
      }
    })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}

// qna 글작성
function createQna(body, user_name, callback) {
  models.blog
    .create({
      blog_title: body.title,
      blog_content: body.content,
      blog_writer: user_name,
      blog_ispublic: body.ispublic,
      blog_user_no: body.user_no,
      blog_category: QNA,
      subject_no: body.subject_no
    })
    .then(result => {
      return callback(null, true);
    })
    .catch(err => {
      return callback(err);
    });
}
// qna 게시글나열
function findAllQna(subject_no, callback) {
  models.blog
    .findAll({
      where: {
        blog_category: QNA,
        subject_no: subject_no
      },
      //limit: 5,
      order: [['created_at', 'DESC']]
    })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}
// qna 글읽기
function readQna(subject_no, blog_no, callback) {
  models.blog
    .find({
      where: {
        blog_no: blog_no,
        subject_no: subject_no
      }
    })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}

// ppt 글작성
function createPpt(body, user_name, callback) {
  models.blog
    .create({
      blog_title: body.title,
      blog_content: body.content,
      blog_writer: user_name,
      blog_ispublic: body.ispublic,
      blog_user_no: body.user_no,
      blog_category: PPT,
      subject_no: body.subject_no
    })
    .then(result => {
      return callback(null, true);
    })
    .catch(err => {
      return callback(err);
    });
}
// ppt 게시글나열
function findAllPpt(subject_no, callback) {
  models.blog
    .findAll({
      where: {
        blog_category: PPT,
        subject_no: subject_no
      },
      //limit: 5,
      order: [['created_at', 'DESC']]
    })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}
// ppt 글읽기
function readPpt(subject_no, blog_no, callback) {
  models.blog
    .find({
      where: {
        blog_no: blog_no,
        subject_no: subject_no
      }
    })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}
