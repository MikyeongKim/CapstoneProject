'use strict';
module.exports = (sequelize, DataTypes) => {
    var Task = sequelize.define('Task', {
        task_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        task_title: { type: DataTypes.STRING, allowNull: false },
        task_content: { type: DataTypes.TEXT, allowNull: false },
        task_method: {type: DataTypes.STRING},
        task_deadline: { type: DataTypes.TEXT},
        task_fileup: {type: DataTypes.TEXT},
        
    }, {
            freezeTableName: true,
            tableName: "tbl_task",
            underscored: true,
            timestamps: true
        });

        Task.associate = function (models) {
        Task.belongsTo(models.User, { foreignKey: 'task_user_no' });
        Task.belongsTo(models.Subject, { foreignKey: 'task_subject_no' });
        Task.belongsTo(models.Category, { foreignKey: 'task_category' });
        
    };
    return Task;
};