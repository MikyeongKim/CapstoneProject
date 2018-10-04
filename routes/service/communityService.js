const boardDAO = require('../Repository/Repo_board');
const comFunc = require('../func/comFunc');

listAllCommunity = async (req, res, next) => {
  let curPage = req.param.page;
  let path;
  let result;

  try {
    result = await boardDAO.listAllCommunity();
  } catch (e) {
    return res.send(
      'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
    );
  }
  result = comFunc.paging(curPage, result);

  if (!req.session.userinfo) {
    path = 'common';
  } else {
    path = 'student';
  }

  return res.render(`${path}/community`, {
    board_list: result
  });
};

createCommunity = async (req, res, next) => {
  if (!req.session.userinfo) {
    res.status(401).redirect('/');
  }

  const { content, title, board_department } = req.body;
  const params = {
    userno: req.session.userinfo[0],
    content,
    title,
    board_department
  };
  try {
    await boardDAO.createCommunity(params);
  } catch (e) {
    return res.send(
      'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
    );
  }
  return res.redirect('/community');
};

readCommunity = async (req, res, next) => {
  const req_board_no = req.params.id;
  let boardResult, updateResult, replyResult;

  try {
    [boardResult, updateResult, replyResult] = await boardDAO.readCommunity(
      req_board_no
    );
  } catch (e) {
    return res.send(
      'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
    );
  }

  if (!boardResult) res.status(404).send('404 Not Found');

  if (!req.session.userinfo) {
    return res.render('common/boardread', {
      readBoard: boardResult,
      reply: replyResult
    });
  }

  const user_no = req.session.userinfo[0];

  comFunc.IsWriter(replyResult, user_no);
  return res.render('student/boardread', {
    readBoard: boardResult,
    writer: boardResult.board_user_no === user_no,
    reply: replyResult
  });
};

updateFormCommunity = async (req, res, next) => {
  if (!req.session.userinfo) {
    return res.status(401).redirect('/community');
  }

  const board_no = req.params.id;
  const user_no = req.session.userinfo[0];
  let result;
  try {
    result = await boardDAO.findBoard(board_no);
  } catch (e) {
    return res.status(500).send('updateFormCommunity error');
  }

  if (result.board_user_no != user_no) return res.status(403).send('forbidden');
  return res.render('student/boardedit', { data: result });
};

updateCommunity = async (req, res, next) => {
  if (!req.session.userinfo) {
    return res.status(401).json({ massage: '비정상적인 접근' });
  }

  const board_no = req.params.id;
  const body = req.body;
  const user_no = req.session.userinfo[0];
  let result;
  try {
    result = await boardDAO.findBoard(board_no);
  } catch (e) {
    return res.send(
      'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
    );
  }
  if (!result) res.status(404).json('404');

  if (result.board_user_no != user_no) {
    return res.status(403).json('forbidden');
  }

  try {
    result = await boardDAO.updateCommunity(body, board_no);
  } catch (e) {
    return res.send(
      'community list error 이것좀 작업해 종화야 에러처리 등록해라.!'
    );
  }

  return res.json({ result: true });
};

deleteCommunity = async (req, res, next) => {
  if (!req.session.userinfo) {
    return res.status(401).json({ massage: '비정상적인 접근' });
  }

  const board_no = req.params.id;
  const user_no = req.session.userinfo[0];
  let result;

  try {
    result = await boardDAO.findBoard(board_no);
  } catch (e) {
    return res.status(500).send('delete community error');
  }

  if (result.board_user_no != user_no) {
    return res.status(403).json('forbidden');
  }
  try {
    await boardDAO.deleteCommunity(board_no);
  } catch (e) {
    return res.status(500).send('delete community error');
  }

  return res.json({ result: true });
};

module.exports = {
  listAllCommunity,
  createCommunity,
  readCommunity,
  updateCommunity,
  deleteCommunity,
  updateFormCommunity
};
