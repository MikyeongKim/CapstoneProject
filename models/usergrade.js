'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserGrade = sequelize.define('UserGrade', {
    usergrade_num : { type : DataTypes.INTEGER, primaryKey : true, allowNull : false},
    usergrade_name: { type : DataTypes.STRING, unique : true, allowNull: false},
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    freezeTableName: true,
    tableName: "tbl_user_grade",
    underscored: true,
    timestamps: false
  });
  return UserGrade;
};