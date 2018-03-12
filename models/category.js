'use strict';
module.exports = (sequelize, DataTypes) => {
  var category = sequelize.define('Category', {
    category_id: { type : DataTypes.INTEGER 
                          , primaryKey : true 
                          , allowNull: false 
                          , autoIncrement: true },
    category_name: { type : DataTypes.STRING 
                          , allowNull : false 
                          , unique: true},
  }, {
    classMethods: {
      associate: function(models) {
 
      }
    }, 
    freezeTableName: true,
    tableName: "tbl_category",
    underscored: true,
    timestamps: false
  });
  return category;
};