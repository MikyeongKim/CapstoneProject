'use strict';
module.exports = (sequelize, DataTypes) => {
    var task_submit = sequelize.define('task_submit', {
        task_submit_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        task_submit_content: { type: DataTypes.STRING, allowNull: false },
        task_submit_score: { type: DataTypes.STRING, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_task_submit",
            underscored: true,
            timestamps: true
        });
    task_submit.associate = function (models) {
        task_submit.belongsTo(models.blog, { foreignKey: 'blog_no' });
        task_submit.belongsTo(models.User, { foreignKey: 'user_no' });
    };
    return task_submit;
};