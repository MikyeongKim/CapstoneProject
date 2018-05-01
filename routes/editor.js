const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , exec = require('child_process')
  , fs = require('fs')


const student = 1

router.route('/').get((req, res) => {

  //TODO :: 테스트 끝나면 주석 풀기
  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  }

  if (req.session.userinfo[1] === student) {
    return res.render('student/editor');
  } else {
    return res.render('professor/editor');
  }

  return res.render('professor/editor')

})

router.route('/java').post((req, res) => {
  const content = req.body.content
  const date = new Date()
  const filename = Date.now() + '-' + req.session.userinfo[0];

  let editlogNo;
  models.Editlog.create({
    edit_filepath: 'complieFolder/c/',
    edit_lang: 'JAVA',
    edit_filename: filename,
    edit_user_no: req.session.userinfo[0],
    edit_isSuccess: false
  }).then(result => {
    editlogNo = result.edit_no
  })

  StoreCode(filename, content)

  fs.writeFile(`complieFolder/java/test.java`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }

    const bat = exec.spawn('javacompile.bat');

    bat.stdout.on('data', (result) => {
      fs.readFile('complieFolder/java/test.txt', 'utf-8', (error, data) => {
        
        models.Editlog.update({
          edit_isSuccess: true
        }, {
            where: { edit_no: editlogNo }
          })
        return res.send({ result: true, content: data });
      })
    });

    bat.stderr.on('data', (data) => {
      console.log("여기다2", data.toString());
    });

    bat.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
    });

    /*
    exec.exec('javacompile.bat', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.readFile('complieFolder/java/test.txt', 'utf-8', (error, data) => {
        console.log("아아아아")
        return res.send({ result: true, content: data });
      })
    });

    /*
          exec.execFile('javacompile.bat', (error, stdout, stderr) => {
            const errorhandle = error
            fs.readFile('complieFolder/java/test.txt', 'utf-8', (error, data) => {
    
              if (errorhandle && data.length == 0) {
                return res.send({ result: true, content: `${errorhandle}` });
              }
    
              return res.send({ result: true, content: data });
            });
          });
        } catch (exception) {
          return res.send({ result: true, content: "여기는 오긴 하는건가??" });
        } */
  })
})

router.route('/c').post((req, res) => {
  const content = req.body.content;
  const filename = Date.now() + '-' + req.session.userinfo[0];
  let editlogNo;
  models.Editlog.create({
    edit_filepath: 'complieFolder/c/',
    edit_lang: 'C',
    edit_filename: filename,
    edit_user_no: req.session.userinfo[0],
    edit_isSuccess: false
  }).then(result => {
    editlogNo = result.edit_no
  })

  StoreCode(filename, content)


  fs.writeFile(`complieFolder/c/${filename}.c`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }

    exec.execFile('Compile.bat', [`${filename}`], (error, stdout, stderr) => {
      const errorhandle = error
      fs.readFile(`complieFolder/c/${filename}.txt`, 'utf-8', (error, data) => {

        if (errorhandle && data.length == 0) {
          return res.send({ result: true, content: `${errorhandle}` });
        }

        models.Editlog.update({
          edit_isSuccess: true
        }, {
            where: { edit_no: editlogNo }
          })

        return res.send({ result: true, content: data });
      });
    });
  })
})

router.route('/python').post((req, res) => {
  const content = req.body.content
  const date = new Date()
  const filename = date.getTime()

  fs.writeFile(`complieFolder/c/${filename}.c`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }

    exec.execFile('Compile.bat', [`${filename}`], (error, stdout, stderr) => {
      const errorhandle = error
      fs.readFile(`complieFolder/c/${filename}.txt`, 'utf-8', (error, data) => {

        if (errorhandle && data.length == 0) {
          return res.send({ result: true, content: `${errorhandle}` });
        }
        
        return res.send({ result: true, content: data });
      });
    });
  })
})

router.route('/read/:no&:lang').get((req, res) => {
  const lang = req.params.lang;
  const edit_log_no = req.params.no

  models.Editlog.find({
    where: { edit_no: edit_log_no }
  }).then(result => {
    let path = result.edit_filepath + "origin-" + result.edit_filename + '.txt';
    fs.readFile(path, 'utf-8', (error, data) => {
      if (error) {
        res.send(`error ${error}`)
      }
      console.log(data)
      res.render('professor/editor', {code_content: data , code_lang : lang})

    })
  })

  //   let path = result.edit_filepath +"origin-"+result.edit_filename + '.txt'
  //   console.log(path)

  //   fs.readFile(`complieFolder/c/${result.edit_filename}.txt`, 'utf-8', (error, data) => {

  //     return res.send({ result: true, content: data });
  //   }).catch(err => {
  //     console.log(err)
  //   });
  //   //res.send(`언어 :${lang} 넘버 ${edit_log_no}`)
  // }).catch(err => {
  //   console.log(`여기서 에러난다 ${err}`)
  // })

})



function StoreCode(filename, content) {
  fs.writeFile(`complieFolder/c/origin-${filename}.txt`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }
  })
}

module.exports = router;
