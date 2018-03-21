const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , exec = require('child_process')
  , fs = require('fs')


const student = 1

router.route('/')
  .get((req, res) => {

     //TODO :: 테스트 끝나면 주석 풀기
    if (!req.session.userinfo) {
      return res.status(401).redirect('/login')
    }

    if (req.session.userinfo[1] === student) {
      return res.render('professor/editor');
    } else {
      return res.render('professor/editor');
    }
    
    return res.render('professor/editor')

  })
  .post((req, res) => {
    /*
        1. 요청파일 저장
        2. 컴파일  
        3. 실행
        4. 파일 읽기
        5. 전송
    */

    const content = req.body.content
    const date = new Date()
    const filename = date.getTime()

    fs.writeFile(`complieFolder/${filename}.c`, content, 'utf-8', err => {
      if (err) {
        return res.send(err)
      } else {

        exec.exec(`Compile.bat ${filename}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return res.send(error);
          }

          fs.readFile(`complieFolder/${filename}.txt`, 'utf-8', (error, data) => {
            res.send(data);
          });

          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);

        });

      }
    });
  });


router.route('/java').post((req, res) => {
  const content = req.body.content
  const date = new Date()
  const filename = date.getTime()


  fs.writeFile(`complieFolder/java/test.java`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }
    

    const bat = exec.spawn('javacompile.bat');

    bat.stdout.on('data', (result) => {
      fs.readFile('complieFolder/java/test.txt', 'utf-8', (error, data) => {
        return res.send({ result: true, content: data });
      })
    });

    bat.stderr.on('data', (data) => {
      console.log("여기다2",data.toString());
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
  const content = req.body.content
  const date = new Date()
  const filename = date.getTime()

  fs.writeFile(`complieFolder/c/${filename}.c`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }

    try {
      exec.execFile('Compile.bat', [`${filename}`], (error, stdout, stderr) => {
        const errorhandle = error
        fs.readFile(`complieFolder/c/${filename}.txt`, 'utf-8', (error, data) => {

          if (errorhandle && data.length == 0) {
            return res.send({ result: true, content: `${errorhandle}` });
          }

          return res.send({ result: true, content: data });
        });
      });
    } catch (exception) {
      return res.send({ result: true, content: "여기는 오긴 하는건가??" });
    }
  })
})

router.route('/python').post((req, res) => {
  return res.send({ result: true, content: "개발중입니다." });
})

module.exports = router;
