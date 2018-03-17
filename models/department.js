'use strict';
module.exports = (sequelize, DataTypes) => {
    var Department = sequelize.define('Department', {
        department_no: { type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        department_name: {type: DataTypes.STRING, allowNull: false },
        department_phone: { type: DataTypes.STRING }
    }, {
            freezeTableName: true,
            tableName: "tbl_department",
            underscored: true,
            timestamps: false
        });
    Department.associate = function (models) {
        Department.hasMany(models.Student, { foreignKey: 'department_no', sourceKey: 'department_no' });
        Department.hasMany(models.Professor, { foreignKey: 'department_no', sourceKey: 'department_no' });
        Department.hasMany(models.Manager, { foreignKey: 'department_no', sourceKey: 'department_no' });
        Department.hasMany(models.Board, { foreignKey: 'board_department', sourceKey: 'department_no' });
    };
    return Department;
};