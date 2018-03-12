'use strict';
module.exports = (sequelize, DataTypes) => {
  var board = sequelize.define('Board', {
    board_no : { type : DataTypes.INTEGER 
        , primaryKey : true 
        , allowNull: false 
        , autoIncrement: true },
    board_title : { type : DataTypes.STRING , allowNull: false},
    board_content : { type : DataTypes.TEXT , allowNull: false},
    board_count : { type : DataTypes.INTEGER , allowNull: false , defaultValue : '0'  },
    board_category : { type : DataTypes.INTEGER , allowNull: false , 
      references : { model: 'tbl_category', key: 'category_id'},},
    board_department : { type : DataTypes.INTEGER , allowNull: false ,
        references : { model: 'tbl_department', key: 'department_id'}},
    user_id : { type : DataTypes.STRING , allowNull: false },
  }, {
    classMethods: {
      associate: function(models) {
 
      }
    }, 
    freezeTableName: true,
    tableName: "tbl_board",
    underscored: true,
    timestamps: true
    
  });
  return board;
};