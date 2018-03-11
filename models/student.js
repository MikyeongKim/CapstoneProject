'use strict';
module.exports = (sequelize, DataTypes) => {
  var Student = sequelize.define('Student', {
    student_num : { type : DataTypes.INTEGER, primaryKey : true 
                , allowNull : false, autoIncrement: true },
    student_id: { type : DataTypes.STRING
                , references : {model: 'tbl_user', key: 'user_id'}},
    student_name: { type : DataTypes.STRING, allowNull: false,},
    student_email: { type : DataTypes.STRING , unique: true},
    student_phone: { type : DataTypes.STRING },
    department_id: { type : DataTypes.INTEGER
                    , references : { model: 'tbl_department', key: 'department_id'}} 
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    freezeTableName: true,
    tableName: "tbl_student",
    underscored: true,
    timestamps: true
  });
  return Student;
};