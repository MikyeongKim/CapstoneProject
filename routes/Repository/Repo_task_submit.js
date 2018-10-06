const models = require('../../models');

module.exports = {
  findUserBySubNo,
  saveScorebyTask
};

function findUserBySubNo(sub_no) {
  return models.task_submit.findOne({
    where: { task_submit_no: sub_no },
    include: [
      {
        model: models.User
      }
    ]
  });
}

function saveScorebyTask(task_no, score, cb) {
  models.task_submit
    .update(
      {
        task_submit_score: score
      },
      {
        where: {
          task_submit_no: task_no
        }
      }
    )
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err);
    });
}
