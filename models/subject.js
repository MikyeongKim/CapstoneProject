'use strict';
module.exports = (sequelize, DataTypes) => {
    var subject = sequelize.define('subject', {
        subject_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        subject_place: { type: DataTypes.STRING},
        subject_credit: { type: DataTypes.INTEGER},
        subject_name: {type: DataTypes.STRING ,allowNull: false },
        subject_time: { type: DataTypes.STRING},
        subject_grade : { type: DataTypes.INTEGER},
        subject_goal : { type: DataTypes.STRING},
        subject_book : { type: DataTypes.STRING},
        subject_evaluation : { type: DataTypes.STRING},
        subject_etc : { type: DataTypes.STRING},
        sub_pro_name: { type: DataTypes.STRING, allowNull: false },
        sub_pro_email : { type: DataTypes.STRING },
        sub_plan_1: { type: DataTypes.STRING },
        sub_plan_2: { type: DataTypes.STRING },
        sub_plan_3: { type: DataTypes.STRING },
        sub_plan_4: { type: DataTypes.STRING },
        sub_plan_5: { type: DataTypes.STRING },
        sub_plan_6: { type: DataTypes.STRING },
        sub_plan_7: { type: DataTypes.STRING },
        sub_plan_8: { type: DataTypes.STRING },
        sub_plan_9: { type: DataTypes.STRING },
        sub_plan_10: { type: DataTypes.STRING },
        sub_plan_11: { type: DataTypes.STRING },
        sub_plan_12: { type: DataTypes.STRING },
        sub_plan_13: { type: DataTypes.STRING },
        sub_plan_14: { type: DataTypes.STRING },
        sub_plan_15: { type: DataTypes.STRING },
        sub_plan_16: { type: DataTypes.STRING },
    }, {
            freezeTableName: true,
            tableName: "tbl_subject",
            underscored: true,
            timestamps: true
        })
    subject.associate = function (models) {
        subject.belongsToMany(models.Student, {
            through: {
                model: models.attendclass,
                as : 'attend'
            }
            , foreignKey: 'subject_no'
        }),
        subject.belongsTo(models.subjectType, { foreignKey: 'subjectType_no' });
        subject.belongsTo(models.Professor, { foreignKey: 'professor_no' });
        subject.belongsTo(models.Department, { foreignKey: 'department_no' });
    }
    return subject;
};

