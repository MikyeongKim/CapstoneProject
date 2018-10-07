const logDAO = require('../Repository/Repo_editlog');
const fs = require('fs');
const { promisify } = require('util');
const execPromise = promisify(require('child_process').execFile);
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
  let editlogNo, data;
  try {
    editlogNo = (await logDAO.create('c', FILE_PATH, filename, userNo)).edit_no;
  } catch (e) {
    return res.send('로그저장 실패');
  }
  try {
    await saveCode(filename, content, 'c', params);
    data =
      params !== 'false'
        ? await compileFunc(editlogNo, filename, 'c', true)
        : await compileFunc(editlogNo, filename, 'c');
  } catch (e) {
    return res.send({ result: true, content: 'error' });
  }
  return res.send({ result: true, content: data });
};

javaCompile = async (req, res, next) => {
  const userNo = req.session.userinfo[0];
  const { content, params } = req.body;
  const FILE_PATH = 'complieFolder/java/';
  const filename = Date.now() + '-' + userNo;
  let editlogNo, data;
  try {
    editlogNo = (await logDAO.create('java', FILE_PATH, filename, userNo)).edit_no;
  } catch (e) {
    return res.send('로그저장 실패');
  }

  try {
    await saveCode(filename, content, 'java', params);
    console.log(`save완료`);
    data =
      params !== 'false'
        ? await javaCompileTest(editlogNo, filename, 'java', true)
        : await javaCompileTest(editlogNo, filename, 'java', false);
  } catch (e) {
    console.log(e.stdout.setEncoding('utf8'));
  }

  return res.send({ result: true, content: data });
};

/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/

/**
 * @param {number} editlogNo
 * @param {string} filename
 * @param {string} lang
 * @param {boolean} isParam
 * @return {string}
 */
async function javaCompileTest(editlogNo, filename, lang, isParam) {
  let batch = batchPath(lang, isParam);
  let path = `complieFolder/${lang}/`;
  let result = false;

  try {
    isParam
      ? await execPromise(batch, [`param-${filename}.txt`], { encoding: 'utf8' })
      : await execPromise(batch, { encoding: 'utf8' });
  } catch (e) {
    console.log(e);
    if (e.stderr !== '') {
      result = e.stderr;
    }
  }

  if (!result) {
    try {
      result = await fileRead(`complieFolder/java/test.txt`);
      await fileUnlink('complieFolder/java/test.txt');
      await fileUnlink('complieFolder/java/test.class');
      await logDAO.updateLog(editlogNo);
    } catch (e) {
      console.log(e);
      return 'no such file or directory';
    }
  }
  return result;
}

async function compileFunc(editlogNo, filename, lang, isParam) {
  let batch = batchPath(lang, isParam);
  let path = `complieFolder/${lang}/`;
  let result = false;

  try {
    isParam
      ? await execPromise(batch, [filename, `param-${filename}.txt`], { encoding: 'utf8' })
      : await execPromise(batch, [filename], { encoding: 'utf8' });
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

function batchPath(lang, isParam) {
  let val;
  if (lang === 'c') {
    val = isParam ? 'batch\\c_Param.bat' : 'batch\\c_Compile.bat';
  } else if (lang === 'java') {
    val = isParam ? 'batch\\java_Param.bat' : 'batch\\java_Compile.bat';
  }
  return val;
}

async function saveCode(filename, content, lang, param = false) {
  let files = [
    `complieFolder/${lang}/${filename}.${lang}`,
    `complieFolder/${lang}/origin-${filename}.txt`
  ];
  if (lang === 'java') {
    files = [`complieFolder/${lang}/test.${lang}`, `complieFolder/${lang}/origin-${filename}.txt`];
  }

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

/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/

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

function fileUnlink(path) {
  return new Promise(function(resolve, reject) {
    fs.unlink(path, error => {
      if (error) reject(error);
      else resolve('삭제성공');
    });
  });
}

module.exports = {
  index,
  cCompile,
  javaCompile
};
