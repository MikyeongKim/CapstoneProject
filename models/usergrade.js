'use strict';
module.exports = (sequelize, DataTypes) => {
    var UserGrade = sequelize.define('UserGrade', {
        usergrade_no: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
        usergrade_name: { type: DataTypes.STRING, unique: true, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_usergrade",
            underscored: true,
            timestamps: false
        });
    UserGrade.associate = function (models) {
        UserGrade.hasMany(models.Userlogin, { foreignKey: 'usergrade_no', sourceKey: 'usergrade_no' });
    };
    return UserGrade;
};