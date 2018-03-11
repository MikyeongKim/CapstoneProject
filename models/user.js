'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    user_num : { type : DataTypes.INTEGER, primaryKey : true 
               , allowNull : false, autoIncrement: true },
    user_id: { type : DataTypes.STRING, unique: true, allowNull: false,},
    user_password: { type : DataTypes.STRING, allowNull : false },
    user_grade : { type : DataTypes.INTEGER, defaultValue : '999' 
                  , references : { model: 'tbl_user_grade', key: 'usergrade_num'}}
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    freezeTableName: true,
    tableName: "tbl_user",
    underscored: true,
    timestamps: true
  });
  return User;
};