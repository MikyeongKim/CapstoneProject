const models = require('../../models');
module.exports = {
  listAllCommunity,
  createCommunity,
  readCommunity,
  findBoard,
  updateCommunity,
  deleteCommunity
};
const community_category = 3;

function listAllCommunity() {
  return models.Board.findAll({
    where: {
      board_category: community_category
    },
    order: [['created_at', 'DESC']]
  });
}

function createCommunity(params) {
  return models.sequelize.transaction(t => {
    return models.User.find(
      {
        where: {
          user_no: params.userno
        }
      },
      {
        transaction: t
      }
    ).then(user_result => {
      return models.Board.create(
        {
          board_category: community_category,
          board_title: params.title,
          board_content: params.content,
          board_department: params.board_department,
          board_user_no: user_result.user_no,
          board_writer: user_result.user_name
        },
        {
          transaction: t
        }
      );
    });
  });
}

function readCommunity(board_no) {
  return models.sequelize.Promise.all([
    models.Board.find({
      where: { board_no: board_no }
    }),
    models.Board.update(
      {
        board_count: models.sequelize.literal('board_count+1')
      },
      {
        where: { board_no: board_no }
      }
    ),

    models.Reply.findAll({
      where: { board_no: board_no }
    })
  ]);
}

function findBoard(board_no) {
  return models.Board.find({
    where: {
      board_no: board_no
    }
  });
}

function updateCommunity(body, board_no) {
  return models.Board.update(
    {
      board_title: body.title,
      board_content: body.content,
      board_department: body.board_department
    },
    {
      where: { board_no: board_no }
    }
  );
}

function deleteCommunity(board_no, callback) {
  return models.Board.destroy({
    where: {
      board_no: board_no
    }
  });
}
