'use strict';
module.exports = (sequelize, DataTypes) => {
  var Userlogin = sequelize.define('Userlogin', {
    user_no: {
      type: DataTypes.INTEGER, primaryKey: true
      , allowNull: false, autoIncrement: true
    },
    user_id: { type: DataTypes.STRING, unique: true, allowNull: false, },
    user_password: { type: DataTypes.STRING, allowNull: false },
  }, {
      freezeTableName: true,
      tableName: "tbl_user_login",
      underscored: true,
      timestamps: false
    });
  Userlogin.associate = function (models) {
    Userlogin.belongsTo(models.UserGrade, { foreignKey: 'usergrade_no' });

  };

  return Userlogin;
};