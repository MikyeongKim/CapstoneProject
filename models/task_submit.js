'use strict';
module.exports = (sequelize, DataTypes) => {
    var task_submit = sequelize.define('task_submit', {
        task_submit_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        task_submit_content: { type: DataTypes.TEXT, allowNull: false },
        task_submit_score: { type: DataTypes.INTEGER },
    }, {
            freezeTableName: true,
            tableName: "tbl_task_submit",
            underscored: true,
            timestamps: true
        });
    task_submit.associate = function (models) {
        task_submit.belongsTo(models.blog, { foreignKey: 'blog_no' });
        task_submit.belongsTo(models.User, { foreignKey: 'user_no' });
        task_submit.hasMany(models.submit_file, { foreignKey: 'task_submit_no', sourceKey: 'task_submit_no' });
    };
    return task_submit;
};