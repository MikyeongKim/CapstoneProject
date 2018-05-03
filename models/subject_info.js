'use strict';
module.exports = (sequelize, DataTypes) => {
    var Subject_info = sequelize.define('Subject_info', {
        subject_category: { type: DataTypes.STRING, allowNull: false },
        subject_class: { type: DataTypes.STRING, allowNull: false },
        subject_department: { type: DataTypes.STRING, allowNull: false },
        subject_grade: { type: DataTypes.STRING, allowNull: false },
        subject_goal: { type: DataTypes.TEXT, allowNull: false },
        subject_ref: { type: DataTypes.TEXT, allowNull: false },
        subject_point: { type: DataTypes.TEXT, allowNull: false },
        subject_time: { type: DataTypes.TEXT, allowNull: false },
        subject_assessment : { type: DataTypes.TEXT, allowNull: false },
        subject_ex : { type: DataTypes.TEXT, allowNull: false },
        subject_1week: { type: DataTypes.TEXT, allowNull: false },
        subject_2week: { type: DataTypes.TEXT, allowNull: false },
        subject_3week: { type: DataTypes.TEXT, allowNull: false },
        subject_4week: { type: DataTypes.TEXT, allowNull: false },
        subject_5week: { type: DataTypes.TEXT, allowNull: false },
        subject_6week: { type: DataTypes.TEXT, allowNull: false },
        subject_7week: { type: DataTypes.TEXT, allowNull: false },
        subject_8week: { type: DataTypes.TEXT, allowNull: false },
        subject_9week: { type: DataTypes.TEXT, allowNull: false },
        subject_10week: { type: DataTypes.TEXT, allowNull: false },
        subject_11week: { type: DataTypes.TEXT, allowNull: false },
        subject_12week: { type: DataTypes.TEXT, allowNull: false },
        subject_13week: { type: DataTypes.TEXT, allowNull: false },
        subject_14week: { type: DataTypes.TEXT, allowNull: false },
        subject_15week: { type: DataTypes.TEXT, allowNull: false },
        subject_16week: { type: DataTypes.TEXT, allowNull: false },
        subject_16week: { type: DataTypes.TEXT, allowNull: false },
        subject_professor_name: { type: DataTypes.TEXT, allowNull: false },
        subject_info_title: { type: DataTypes.TEXT, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_subject_info",
            underscored: true,
            timestamps: true
        });
    Subject_info.associate = function (models) {
        Subject_info.belongsTo(models.Professor, { foreignKey: 'professor_no' });
        Subject_info.belongsTo(models.Subject, { foreignKey: 'subject_no' });  
    };
    return Subject_info;
};