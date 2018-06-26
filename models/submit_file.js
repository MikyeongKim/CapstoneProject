'use strict';
module.exports = (sequelize, DataTypes) => {
    var submit_file = sequelize.define('submit_file', {
        submit_file_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        submit_file_origin_name: { type: DataTypes.STRING, allowNull: false },
        submit_file_save_name: { type: DataTypes.STRING, allowNull: false },
        submit_file_path: { type: DataTypes.STRING, allowNull: false },
        submit_file_isdelete : {type: DataTypes.BOOLEAN, allowNull: false , defaultValue: '0'},
        submit_file_lang : {type: DataTypes.STRING, allowNull: false , defaultValue: '0'}
    }, {
            freezeTableName: true,
            tableName: "tbl_submit_file",
            underscored: true,
            timestamps: true
        });
    submit_file.associate = function (models) {
        submit_file.belongsTo(models.task_submit, { foreignKey: 'task_submit_no' });
    };
    return submit_file;
};