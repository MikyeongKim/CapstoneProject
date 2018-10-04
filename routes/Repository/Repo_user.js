const models = require('../../models');
module.exports = {
  findUserNameByNo
};

function findUserNameByNo(user_no, callback) {
  models.User.find({
    where: { user_no: user_no },
    attributes: ['user_name']
  })
    .then(result => {
      return callback(null, result);
    })
    .catch(err => {
      return callback(err);
    });
}
