const models = require('../../models')
    , exec = require('child_process')
    , fs = require('fs')

module.exports = {
    compileFunc: compileFunc
    , createLog: createLog
    , logicExecute: logicExecute
    , javaCompile: javaCompile
    , saveCode: saveCode
    , paramExecute: paramExecute
};

function logicExecute(content, userno, lang, callback) {
  const filename = Date.now() + '-' + userno;
  let editlogNo;

  createLog(filename, userno, lang, editLog => {
      editlogNo = editLog;
  });

  saveCode(filename, content, lang);

  if (lang == 'java') {
    javaCompile(editlogNo, callback)
  }
  else {
    compileFunc(editlogNo, filename, lang, data => {
        callback(data);
    })
  }
}

function paramExecute(content, param, userno, lang, callback) {
  const filename = Date.now() + '-' + userno;
  let editlogNo;

  createLog(filename, userno, lang, editLog => {
      editlogNo = editLog;
  });

  saveCode(filename, content, lang, param);

  if (lang == 'java') {
    javaParamCompile(editlogNo, filename, callback)
  }
  else {
    compileParamFunc(editlogNo, filename, lang, data => {
      callback(data);
    })
  }
}

function langPath(lang, callback) {
  callback(`complieFolder/${lang}/`)
}

function createLog(filename, user_no, lang, callback) {
  let filepath;

  langPath(lang, (filepath) => {
    models.Editlog.create({
      edit_filepath: filepath,
      edit_lang: lang,
      edit_filename: filename,
      edit_user_no: user_no,
      edit_isSuccess: false
    }).then(result => {
      callback(result.edit_no)
    })
  })
}

function updateLog(editlogNo) {
    models.Editlog.update({
        edit_isSuccess: true
    }, { where: { edit_no: editlogNo } })
}

function saveCode(filename, content, lang, param=false) {
  let files = [`complieFolder/${lang}/${filename}.${lang}`, `complieFolder/${lang}/origin-${filename}.txt`]
  if (lang == 'java') {
    files = [`complieFolder/${lang}/test.${lang}`, `complieFolder/${lang}/origin-${filename}.txt`]
  } else if (lang == 'python') {
    files = [`complieFolder/${lang}/${filename}.py`, `complieFolder/${lang}/origin-${filename}.txt`]
  }

  let len = files.length;
  for (let i = 0; i < len; i++) {
    fs.writeFile(files[i], content, 'utf-8', err => {
      if (err) {
        return err
      }
    })
  }
  if (param) {
    fs.writeFile(`complieFolder/${lang}/param-${filename}.txt`, param, 'utf-8', err => {
      if (err) {
        console.log(`파람 write에러 ${err}`)
        return err
      }
    })
  }
}


function compileFunc(editlogNo, filename, lang, callback) {
  let batch;
  if (lang == 'c') {
      batch = 'batch\\c_Compile.bat'
  } else if (lang == 'python') {
      batch = 'batch\\python_Compile.bat'
  }

  langPath(lang, (path) => {
    exec.execFile(batch, [`${filename}`], (error, stdout, stderr) => {
      const errorhandle = error
      fs.readFile(`${path}${filename}.txt`, 'utf-8', (error, data) => {
        if (errorhandle && data.length == 0) {
          return callback(`${errorhandle}`);
        }
        updateLog(editlogNo)
        callback(data)
      });
    })
  })
}

function compileParamFunc(editlogNo, filename, lang, callback) {
  let batch;
  if (lang == 'c') {
      batch = 'batch\\c_Param.bat'
  } else if (lang == 'python') {
      batch = 'batch\\python_Param.bat'
  }

  langPath(lang, (path) => {
    exec.execFile(batch, [`${filename}`, `param-${filename}.txt`], (error, stdout, stderr) => {
      const errorhandle = error
      fs.readFile(`${path}${filename}.txt`, 'utf-8', (error, data) => {
        if (errorhandle && data.length == 0) {
          return callback(`${errorhandle}`);
        }
        updateLog(editlogNo)
        callback(data)
      });
    })
  })
}

function javaCompile(editlogNo, callback) {
  exec.execFile('batch\\java_Compile.bat', [], (error, stdout, stderr) => {
      if (error) {
          return callback(`${error}`)
      }
      fs.readFile(`complieFolder/java/test.txt`, 'utf-8', (err, data) => {
          updateLog(editlogNo)
          fs.unlink(`complieFolder/java/test.class`, err => {
            callback(data)
          });

      });
  })
}

function javaParamCompile(editlogNo, filename, callback) {
  exec.execFile('batch\\java_Param.bat', [`test`, `param-${filename}.txt`], (error, stdout, stderr) => {
      if (error) {
          return callback(`${error}`)
      }
      fs.readFile(`complieFolder/java/test.txt`, 'utf-8', (err, data) => {
          updateLog(editlogNo)
          fs.unlink(`complieFolder/java/test.class`, err => {
            callback(data)
          });

      });
  })
}
