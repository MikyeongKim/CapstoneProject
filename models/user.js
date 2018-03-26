'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        user_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true
        },
        user_name: { type: DataTypes.STRING, allowNull: false, },
        user_email: { type: DataTypes.STRING, unique: true },
        user_phone: { type: DataTypes.STRING },
    }, {
            freezeTableName: true,
            tableName: "tbl_user",
            underscored: true,
            timestamps: true
        })
    User.associate = function (models) {
       User.belongsTo(models.Userlogin, { foreignKey: 'user_no' });
       User.belongsTo(models.Department, { foreignKey: 'department_no' });
    };
    return User;
};