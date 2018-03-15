'use strict';
module.exports = (sequelize, DataTypes) => {
  var reply = sequelize.define('Reply', {
    reply_id: { type : DataTypes.INTEGER 
                          , primaryKey : true 
                          , allowNull: false 
                          , autoIncrement: true },
    board_no: { type : DataTypes.INTEGER  
                          , allowNull : false , allowNull: false 
                        ,references : {model: 'tbl_board', key: 'board_no'}},
    reply_writer: { type : DataTypes.STRING}
    

  }, {
    classMethods: {
      associate: function(models) {
 
      }
    }, 
    freezeTableName: true,
    tableName: "tbl_reply",
    underscored: true,
    timestamps: false
  });
  return reply;
};