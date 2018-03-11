'use strict';
module.exports = (sequelize, DataTypes) => {
  var Professor = sequelize.define('Professor', {
    professor_num : { type : DataTypes.INTEGER, primaryKey : true 
                , allowNull : false, autoIncrement: true },
    professor_id: { type : DataTypes.STRING
                , references : {model: 'tbl_user', key: 'user_id'}},
    professor_name: { type : DataTypes.STRING, allowNull: false,},
    professor_email: { type : DataTypes.STRING , unique: true},
    professor_phone: { type : DataTypes.STRING },
    department_id: { type : DataTypes.INTEGER
                    , references : { model: 'tbl_department', key: 'department_id'}} 
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    freezeTableName: true,
    tableName: "tbl_professor",
    underscored: true,
    timestamps: true
  });
  return Professor;
};