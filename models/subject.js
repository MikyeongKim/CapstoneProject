'use strict';
module.exports = (sequelize, DataTypes) => {
    var Subject = sequelize.define('Subject', {
        subject_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        subject_title: { type: DataTypes.STRING, allowNull: false },
        subject_location: { type: DataTypes.TEXT, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_subject",
            underscored: true,
            timestamps: true
        });
    Subject.associate = function (models) {
        Subject.belongsTo(models.Professor, { foreignKey: 'subject_professor_no' });
        Subject.hasMany(models.Blog, { foreignKey: 'blog_subject_no', sourceKey: 'subject_no' });
        Subject.hasMany(models.Signupsubject, { foreignKey: 'signup_subject_no', sourceKey: 'subject_no' });
    };
    return Subject;
};