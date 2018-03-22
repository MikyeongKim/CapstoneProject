'use strict';
module.exports = (sequelize, DataTypes) => {
    var Student = sequelize.define('Student', {
        student_no: { type: DataTypes.INTEGER, primaryKey: true
                    , allowNull: false, autoIncrement: true},
        student_name: { type: DataTypes.STRING, allowNull: false, },
        }, {
            freezeTableName: true,
            tableName: "tbl_student",
            underscored: true,
            timestamps: true
        })
    Student.associate = function (models) {
        Student.belongsTo(models.User, { foreignKey: 'student_no' });
    };
    return Student;
};