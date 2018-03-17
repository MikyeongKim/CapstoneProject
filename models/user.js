'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    user_no: {
      type: DataTypes.INTEGER, primaryKey: true
      , allowNull: false, autoIncrement: true},
    user_id: { type: DataTypes.STRING, unique: true, allowNull: false, },
    user_password: { type: DataTypes.STRING, allowNull: false },
  }, {
      freezeTableName: true,
      tableName: "tbl_user",
      underscored: true,
      timestamps: false
    });
  User.associate = function (models) {
    User.belongsTo(models.UserGrade, { foreignKey: 'usergrade_no' });
    User.hasMany(models.Board, { foreignKey: 'board_user_no', sourceKey: 'user_no' });
  };

  return User;
};