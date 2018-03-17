'use strict';
module.exports = (sequelize, DataTypes) => {
    var Student = sequelize.define('Student', {
        student_no: { type: DataTypes.INTEGER, primaryKey: true
                    , allowNull: false, autoIncrement: true},
        student_name: { type: DataTypes.STRING, allowNull: false, },
        student_email: { type: DataTypes.STRING, unique: true },
        student_phone: { type: DataTypes.STRING },
        }, {
            freezeTableName: true,
            tableName: "tbl_student",
            underscored: true,
            timestamps: true
        })
    Student.associate = function (models) {
        Student.belongsTo(models.User, { foreignKey: 'student_no' });
        Student.belongsTo(models.Department, { foreignKey: 'department_no' });
    };
    return Student;
};