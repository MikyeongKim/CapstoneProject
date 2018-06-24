'use strict';
module.exports = (sequelize, DataTypes) => {
    var taskinfo = sequelize.define('taskinfo', {
        taskinfo_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true},
        taskinfo_method: {
            type: DataTypes.STRING, allowNull: false},
        taskinfo_name : {
            type: DataTypes.STRING , allowNull : false },
        taskinfo_period: {
            type: DataTypes.DATE, allowNull: false
        }
    }, {
            freezeTableName: true,
            tableName: "tbl_taskinfo",
            underscored: true,
            timestamps: true
        });

    taskinfo.associate = function (models) {
        taskinfo.belongsTo(models.blog, { foreignKey: 'blog_no' });
    };
    return taskinfo;
};