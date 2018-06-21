'use strict';
module.exports = (sequelize, DataTypes) => {
    var subjectType = sequelize.define('subjectType', {
        subjectType_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true
        },
        subjectType_name: { type: DataTypes.STRING, allowNull: false, },
    }, {
            freezeTableName: true,
            tableName: "tbl_subjectType",
            underscored: true,
            timestamps: false
        })
    subjectType.associate = function (models) {
        subjectType.hasMany(models.subject, { foreignKey: 'subjectType_no', sourceKey: 'subjectType_no' });
    };
    return subjectType;
};