const models = require('../../models')
    , exec = require('child_process')
    , fs = require('fs')

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

function langPath(lang, callback) {
    if (lang == 'c') {
        filepath = 'complieFolder/c/';
    } else if (lang == 'java') {
        filepath = 'complieFolder/java/'
    } else {
        filepath = 'complieFolder/python/'
    }
    callback(filepath)
}

function updateLog(editlogNo) {
    models.Editlog.update({
        edit_isSuccess: true
    }, { where: { edit_no: editlogNo } })
}

function saveCode(filename, content, lang) {
    let files = [`complieFolder/${lang}/${filename}.${lang}`, `complieFolder/${lang}/origin-${filename}.txt`]
    if (lang == 'java') {
        files = [`complieFolder/${lang}/test.${lang}`, `complieFolder/${lang}/origin-${filename}.txt`]
    } else if (lang == 'python') {
        files = [`complieFolder/${lang}/${filename}.py`, `complieFolder/${lang}/origin-${filename}.txt`]
    }

    for (let i = 0; i < files.length; i++) {
        fs.writeFile(files[i], content, 'utf-8', err => {
            if (err) {
                return res.send(err)
            }
        })
    }
}

function javaCompile(editlogNo, callback) {
    exec.execFile(`batch\\java_Compile.bat`, [], (error, stdout, stderr) => {
        if (error) {
            console.log(`에러에들어왔따. ${error}`)
            return callback(`${error}`)
        }
        if (stderr) {
            console.log("사발")
        }
        fs.readFile(`complieFolder/java/test.txt`, 'utf-8', (err, data) => {
            updateLog(editlogNo)
            callback(data)
        });
    })

    /*
    
    const bat = exec.spawn(`batch\\java_Compile.bat`);
    bat.stdout.on('data', (result) => {
      fs.readFile('complieFolder/java/test.txt', 'utf-8', (error, data) => {
        updateLog(editlogNo)
        return callback(data)
      })
    });
  
    bat.stderr.on('data', (data) => {
      return callback(data)
    });
  
    bat.on('exit', (code) => {
      return callback(code)
    });
  */
}

module.exports = {
    javaCompile : javaCompile,
    compileFunc : compileFunc,
    createLog : createLog,
    saveCode : saveCode
};