const exec = require('child_process');
const logDAO = require('../Repository/Repo_editlog');
const fs = require('fs');
const { promisify } = require('util');
const execPromise = promisify(exec.execFile);
const STUDENT = 1;

index = (req, res) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login');
  }

  if (req.session.userinfo[1] === STUDENT) {
    return res.render('student/editor');
  }
  return res.render('student/editor', { readcode: false });
};

cCompile = async (req, res, next) => {
  const userNo = req.session.userinfo[0];
  const { content, params } = req.body;
  const FILE_PATH = 'complieFolder/c/';
  const filename = Date.now() + '-' + userNo;
  let editlogNo;
  try {
    editlogNo = (await logDAO.create('c', FILE_PATH, filename, userNo)).edit_no;
  } catch (e) {
    return res.send('로그저장 실패');
  }
  saveCode(filename, content, 'c', params);
  let data = await compileFunc(editlogNo, filename, 'c');

  return res.send({ result: true, content: data });
};

/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/

async function compileFunc(editlogNo, filename, lang) {
  let batch = 'batch\\c_Compile.bat';
  if (lang == 'python') {
    batch = 'batch\\python_Compile.bat';
  }
  let path = `complieFolder/${lang}/`;
  let result = false;

  try {
    await execPromise(batch, [filename], { encoding: 'utf-8' });
  } catch (e) {
    if (e.stderr !== '') {
      result = e.stderr;
    }
  }

  if (!result) {
    try {
      result = await fileRead(`${path}${filename}.txt`);
      await logDAO.updateLog(editlogNo);
    } catch (e) {
      console.log(e);
      return '파일 읽기 실패';
    }
  }

  return result;
}

async function saveCode(filename, content, lang, param = false) {
  let files = [
    `complieFolder/${lang}/${filename}.${lang}`,
    `complieFolder/${lang}/origin-${filename}.txt`
  ];
  try {
    await Promise.all([fileSave(files[0], content), fileSave(files[1], content)]);
    if (param) {
      await fileSave(`complieFolder/${lang}/param-${filename}.txt`, param);
    }
  } catch (e) {
    console.log('promise all 오류');
    console.log(e);
  }
}

function fileSave(path, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, data, 'utf-8', function(error, data) {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

function fileRead(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf-8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

module.exports = {
  index,
  cCompile
};
