const models = require('../../models');

create = (lang, filepath, filename, userNo) => {
  return models.Editlog.create({
    edit_filepath: filepath,
    edit_lang: lang,
    edit_filename: filename,
    edit_user_no: userNo,
    edit_isSuccess: false
  });
};

module.exports = {
  create
};
