const express = require('express');
const router = express.Router();
const service = require('./service/communityService');

router.route('/').get((req, res) => {
  let path;
  let curPage = req.param('page');

  service.listAllCommunity(curPage, (err, result) => {
    if (err) {
      return res.send(
        'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
      );
    }

    if (!req.session.userinfo) {
      path = 'common';
    } else {
      path = 'student';
    }

    return res.render(`${path}/community`, {
      board_list: result
    });
  });
});

router.route('/').post((req, res) => {
  if (!req.session.userinfo) {
    res.status(401).redirect('/');
  }

  const body = req.body;
  const params = {
    userno: req.session.userinfo[0],
    content: req.body.content,
    title: req.body.title,
    board_department: req.body.board_department
  };

  service.createCommunity(params, (err, result) => {
    if (err) {
      return res.send(
        'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
      );
    }

    return res.redirect('/community');
  });
});

router.route('/new').get((req, res) => {
  if (!req.session.userinfo) {
    res.status(401).redirect('/');
  }
  res.render('common/boardinsert');
});

router.route('/:id').get((req, res) => {
  const req_board_no = req.params.id;

  if (!req.session.userinfo) {
    service.readCommunity(req_board_no, (err, result) => {
      if (err) {
        return res.send(
          'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
        );
      }

      return res.render('common/boardread', {
        readBoard: result.boardResult,
        reply: result.replyResult
      });
    });
  } else {
    const user_no = req.session.userinfo[0];
    service.readCommunityAuth(req_board_no, user_no, (err, result) => {
      if (err) {
        return res.send(
          'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
        );
      }
      return res.render('student/boardread', {
        readBoard: result.readBoard,
        writer: result.writer,
        reply: result.reply
      });
    });
  }
});

router.route('/:id').put((req, res) => {
  if (!req.session.userinfo) {
    return res.status(401).json({ massage: '비정상적인 접근' });
  }

  const board_no = req.params.id;
  const body = req.body;
  const user_no = req.session.userinfo[0];

  service.updateCommunity(body, board_no, user_no, (err, result) => {
    if (err) {
      return res.send(
        'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
      );
    }

    return res.json({ result: true });
  });
});

router.route('/:id').delete((req, res) => {
  if (!req.session.userinfo) {
    return res.status(401).json({ massage: '비정상적인 접근' });
  }

  const board_no = req.params.id;
  const user_no = req.session.userinfo[0];

  service.deleteCommunity(board_no, user_no, (err, result) => {
    if (err) {
      return res.send(
        'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
      );
    }

    return res.json({ result: true });
  });
});

router.route('/:id/edit').get((req, res) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/community');
  }

  const board_no = req.params.id;
  const user_no = req.session.userinfo[0];

  service.updateFormCommunity(board_no, user_no, (err, result) => {
    if (err) {
      return res.send(
        'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
      );
    }
    return res.render('common/boardedit', { data: result });
  });
});

module.exports = router;
