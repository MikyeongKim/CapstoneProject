const models = require('../../models');

function findUserNameByNo(user_no) {
  return models.User.find({
    where: { user_no },
    attributes: ['user_name']
  });
}

module.exports = {
  findUserNameByNo
};
