const exec = require('child_process');
const log = require('../Repository/Repo_editlog');
const fs = require('fs');

cCompile = async (req, res, next) => {
  const userNo = req.session.userinfo[0];
  const { content, params } = req.body;
  const FILE_PATH = 'complieFolder/c/';
  const filename = Date.now() + '-' + userNo;

  try {
    await log.create('c', FILE_PATH, filename, userNo);
  } catch (e) {
    return res.send('로그저장 실패');
  }

  saveCode(filename, content, 'c');
  res.send('성공했엉');
};

function saveCode(filename, content, lang, param = false) {
  let files = [
    `complieFolder/${lang}/${filename}.${lang}`,
    `complieFolder/${lang}/origin-${filename}.txt`
  ];


  Promise.all()

  for (let i = 0; i < 2; i++) {
    fs.writeFile(files[i], content, 'utf-8', err => {
      if (err) {
        return err;
      }
    });
  }
  if (param) {
    fs.writeFile(`complieFolder/${lang}/param-${filename}.txt`, param, 'utf-8', err => {
      if (err) {
        return err;
      }
    });
  }
}

module.exports = {
  cCompile
};
