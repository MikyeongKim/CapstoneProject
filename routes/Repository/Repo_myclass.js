const models = require('../../models');

const NOTICE = 5,
  QNA = 6,
  PPT = 7,
  TASK = 8;

function findClassByStu(userno) {
  return models.Student.findAll({
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
  });
}

function findClassByPro(userno, callback) {
  return models.subject.findAll({
    where: { professor_no: userno }
  });
}

function findPlanByAll(subject_no) {
  return models.subject.findAll({
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
  });
}

function createNotice(body, user_name) {
  return models.blog.create({
    blog_title: body.title,
    blog_content: body.content,
    blog_writer: user_name,
    blog_ispublic: body.ispublic,
    blog_user_no: body.user_no,
    blog_category: NOTICE,
    subject_no: body.subject_no
  });
}

function findAllNotice(subject_no, callback) {
  return models.blog.findAll({
    where: {
      blog_category: NOTICE,
      subject_no: subject_no
    },
    //limit: 5,
    order: [['created_at', 'DESC']]
  });
}

function readNotice(subject_no, blog_no) {
  return models.blog.find({
    where: {
      blog_no,
      subject_no
    }
  });
}

function createQna(body, user_name) {
  return models.blog.create({
    blog_title: body.title,
    blog_content: body.content,
    blog_writer: user_name,
    blog_ispublic: body.ispublic,
    blog_user_no: body.user_no,
    blog_category: QNA,
    subject_no: body.subject_no
  });
}

function findAllQna(subject_no) {
  return models.blog.findAll({
    where: {
      blog_category: QNA,
      subject_no: subject_no
    },
    //limit: 5,
    order: [['created_at', 'DESC']]
  });
}

// qna 글읽기
function readQna(subject_no, blog_no) {
  return models.blog.find({
    where: {
      blog_no,
      subject_no
    }
  });
}

function createPpt(body, user_name) {
  return models.blog.create({
    blog_title: body.title,
    blog_content: body.content,
    blog_writer: user_name,
    blog_ispublic: body.ispublic,
    blog_user_no: body.user_no,
    blog_category: PPT,
    subject_no: body.subject_no
  });
}

function findAllPpt(subject_no) {
  return models.blog.findAll({
    where: {
      blog_category: PPT,
      subject_no
    },
    //limit: 5,
    order: [['created_at', 'DESC']]
  });
}

function readPpt(subject_no, blog_no) {
  return models.blog.find({
    where: {
      blog_no,
      subject_no
    }
  });
}

function findAllTask(subject_no) {
  return models.blog.findAll({
    where: {
      blog_category: TASK,
      subject_no
    },
    include: [
      {
        model: models.taskinfo
      }
    ],
    //limit: 5,
    order: [['created_at', 'DESC']]
  });
}

function readTaskStu(user_no, blog_no) {
  return models.sequelize.Promise.all([
    models.blog.find({
      where: {
        blog_category: TASK,
        blog_no: blog_no
      },
      include: [
        {
          model: models.taskinfo
        },
        {
          model: models.file,
          where: {
            file_isdelete: '0'
          }
        }
      ]
    }),
    models.task_submit.findOne({
      where: {
        blog_no: blog_no,
        user_no: user_no
      },
      attributes: ['task_submit_no', 'task_submit_content', 'task_submit_score', 'created_at'],
      include: [
        {
          model: models.submit_file,
          where: {
            submit_file_isdelete: '0'
          }
        }
      ]
    })
  ]);
}

function readTaskPro(blog_no) {
  return models.sequelize.Promise.all([
    models.blog.find({
      where: {
        blog_category: TASK,
        blog_no: blog_no
      },
      include: [
        {
          model: models.taskinfo
        },
        { model: models.file }
      ]
    }),
    models.task_submit.findAll({
      where: {
        blog_no: blog_no
      },
      attributes: ['task_submit_content', 'task_submit_score'],
      include: [
        {
          model: models.User
        },
        {
          model: models.submit_file,
          where: {
            submit_file_isdelete: '0'
          }
        }
      ]
    })
  ]);
}

function createFileTask(body, user_name, time, time_sec, files) {
  return models.sequelize.transaction(function(t) {
    return models.blog
      .create(
        {
          blog_title: body.title,
          blog_content: body.content,
          blog_writer: user_name,
          blog_user_no: body.user_no,
          blog_category: TASK,
          subject_no: body.subject_no
        },
        { transaction: t }
      )
      .then(result => {
        models.sequelize.Promise.all(
          [
            models.taskinfo.create({
              taskinfo_method: body.how,
              taskinfo_name: body.taskName,
              taskinfo_period: time,
              taskinfo_seconds: time_sec,
              blog_no: result.blog_no
            }),
            models.file.create({
              file_origin_name: files.originalname,
              file_save_name: files.filename,
              file_path: files.path,
              blog_no: result.blog_no
            })
          ],
          { transaction: t }
        );
      });
  });
}

function createTask(body, user_name, time, time_sec) {
  return models.sequelize.transaction(function(t) {
    return models.blog
      .create(
        {
          blog_title: body.title,
          blog_content: body.content,
          blog_writer: user_name,
          blog_user_no: body.user_no,
          blog_category: TASK,
          subject_no: body.subject_no
        },
        { transaction: t }
      )
      .then(result => {
        return models.taskinfo.create(
          {
            taskinfo_method: body.how,
            taskinfo_name: body.taskName,
            taskinfo_period: time,
            taskinfo_seconds: time_sec,
            blog_no: result.blog_no
          },
          { transaction: t }
        );
      });
  });
}

module.exports = {
  findAllTask,
  findAllNotice,
  findAllQna,
  findAllPpt,
  findClassByStu,
  findClassByPro,
  findPlanByAll,
  createNotice,
  readNotice,
  createQna,
  readQna,
  createPpt,
  readPpt,
  readTaskStu,
  readTaskPro,
  createFileTask,
  createTask
};
