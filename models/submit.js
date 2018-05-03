'use strict';
module.exports = (sequelize, DataTypes) => {
    var Submit = sequelize.define('Submit', {
        submit_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        submit_title: { type: DataTypes.STRING, allowNull: false },
        submit_content: { type: DataTypes.TEXT, allowNull: false },
        submit_fileup: { type: DataTypes.TEXT },
        submit_point: { type: DataTypes.INTEGER },
        submit_writer: { type: DataTypes.STRING, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_submit",
            underscored: true,
            timestamps: true
        });

    Submit.associate = function (models) {
        Submit.belongsTo(models.User, { foreignKey: 'submit_user_no' });
        Submit.belongsTo(models.Subject, { foreignKey: 'submit_subject_no' });
        Submit.belongsTo(models.Category, { foreignKey: 'submit_task_category' });
        Submit.belongsTo(models.Task, { foreignKey: 'submit_task_no' });
    };
    return Submit;
};