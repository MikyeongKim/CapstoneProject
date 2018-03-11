'use strict';
module.exports = (sequelize, DataTypes) => {
  var department = sequelize.define('Department', {
    department_id: { type : DataTypes.INTEGER 
                          , primaryKey : true 
                          , allowNull: false 
                          , autoIncrement: true },
    department_name: { type : DataTypes.STRING 
                          , allowNull : false },
    department_phone: { type : DataTypes.STRING}
    

  }, {
    classMethods: {
      associate: function(models) {
 
      }
    }, 
    freezeTableName: true,
    tableName: "tbl_department",
    underscored: true,
    timestamps: false
  });
  return department;
};