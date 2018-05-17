const express = require('express')
  , router = express.Router()
  , models = require('../models')
  , exec = require('child_process')
  , fs = require('fs')


const student = 1

router.route('/').get((req, res) => {

  if (!req.session.userinfo) {
    return res.status(401).redirect('/login')
  }

  if (req.session.userinfo[1] === student) {
    return res.render('student/editor');
  }
  return res.render('professor/editor', { readcode : false });

})

router.route('/java').post((req, res) => {
  const content = req.body.content
  const date = new Date()
  const filename = Date.now() + '-' + req.session.userinfo[0];

  let editlogNo;
  models.Editlog.create({
    edit_filepath: 'complieFolder/java/',
    edit_lang: 'JAVA',
    edit_filename: filename,
    edit_user_no: req.session.userinfo[0],
    edit_isSuccess: false
  }).then(result => {
    editlogNo = result.edit_no
  })

  StoreCode(filename, content , 'java')

  fs.writeFile(`complieFolder/java/test.java`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }

    const bat = exec.spawn(`batch\\java_Compile.bat`);

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

  })
})

/* 에디터페이지의 Run 클릭시 Ajax방식으로 컴파일 실행결과를 결과창에 표시 */
router.route('/c').post((req, res) => {

  // 미로그인시 거절!
  if (! req.session.userinfo ) {
    return res.send({ result: false});
  }
  // 소스내용 저장
  const content = req.body.content;
  // 저장할 파일명은 현재시간에 로그인유저정보
  const filename = Date.now() + '-' + req.session.userinfo[0];

  // 데이터베이스 테이블 Editlog에 정보 생성
  let editlogNo;
  models.Editlog.create({
    edit_filepath: 'complieFolder/c/',      // 파일경로
    edit_lang: 'C',                         // 언어
    edit_filename: filename,                // 파일이름
    edit_user_no: req.session.userinfo[0],  // 세션정보
    edit_isSuccess: false                   // 실패?
  }).then(result => {
    editlogNo = result.edit_no              // 생성된 데이터의 기본키값을 저장
  })

  // 추후에 불러올 소스내용 텍스트로 저장
  StoreCode(filename, content , 'c')

  // 첫번째 인자로 들어가는 폴더경로에 컴파일시간을 이름으로 하는 C 소스파일 생성
  // 소스내용은 editor페이지에서 입력한 소스, 인코딩방식은 utf-8
  // C소스파일을 생성후 err함수 실행
  fs.writeFile(`complieFolder/c/${filename}.c`, content, 'utf-8', err => {
    // error 발생시 err메시지 화면에 출력
    if (err) {
      return res.send(err)
    }

    // 프로젝트 루트 폴더에 있는 Compile.bat 파일 실행
    // 두번째 인자로 넘겨주는것이 실행할 C소스파일명
    // Compile.bat 파일이 실행되면 complieFolder/c 경로에 파일이름을 가진
    // exe 파일과 실행파일의 결과를 담은 txt 파일이 생성
    // 실행완료시 다음함수 실행
    exec.execFile(`batch\\c_Compile.bat`, [`${filename}`], (error, stdout, stderr) => {
      const errorhandle = error

      // 실행파일의 결과를 담은 txt 파일 내용 읽기
      fs.readFile(`complieFolder/c/${filename}.txt`, 'utf-8', (error, data) => {

        // 컴파일 폴더의 내용물 비우기
        // exec.execFile('batch\\FileClear.bat')

        // 에러발생과 txt파일 내용이 없으면 결과창으로 보내버림
        // 애초에 C소스파일에 에러가 있으면 생성된 txt 는 빈 파일임
        if (errorhandle && data.length == 0) {
          return res.send({ result: true, content: `${errorhandle}` });
        }

        // 여기까지 진입하면 컴파일 성공이므로 성공으로 DB정보 업데이트
        models.Editlog.update({
          edit_isSuccess: true
        }, {
            where: { edit_no: editlogNo }
          })

        // 에러가 없다면?? 성공적으로 컴파일 된것이므로 실행결과 보내버림
        return res.send({ result: true, content: data });
      });
    });
  })
})

router.route('/python').post((req, res) => {
  if (! req.session.userinfo ) {
    return res.send({ result: false});
  }
  const content = req.body.content;
  const filename = Date.now() + '-' + req.session.userinfo[0];

  let editlogNo;
  models.Editlog.create({
    edit_filepath: 'complieFolder/python/',   // 파일경로
    edit_lang: 'PYTHON',                      // 언어
    edit_filename: filename,                  // 파일이름
    edit_user_no: req.session.userinfo[0],    // 세션정보
    edit_isSuccess: false                     // 컴파일 성공여부 처음은 실패!
  }).then(result => {
    editlogNo = result.edit_no                // 생성된 데이터의 기본키값을 저장
  })

  StoreCode(filename, content , 'python')

  fs.writeFile(`complieFolder/python/${filename}.py`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }
    exec.execFile(`batch\\python_Compile.bat`, [`${filename}`], (error, stdout, stderr) => {
      const errorhandle = error

      fs.readFile(`complieFolder/python/${filename}.txt`, 'utf-8', (error, data) => {

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
      res.render('professor/editor', { readcode: true , code_content: data, code_lang: lang })

    })
  })
})

// 파일명, 내용, 언어를 인자로 받아 origin붙은 텍스트파일생성 >> 추후에 불러올때
function StoreCode(filename, content , lang) {
  fs.writeFile(`complieFolder/${lang}/origin-${filename}.txt`, content, 'utf-8', err => {
    if (err) {
      return res.send(err)
    }
  })
}

module.exports = router;
