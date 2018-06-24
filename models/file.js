'use strict';
module.exports = (sequelize, DataTypes) => {
    var file = sequelize.define('file', {
        file_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        file_origin_name: { type: DataTypes.STRING, allowNull: false },
        file_save_name: { type: DataTypes.STRING, allowNull: false },
        file_path: { type: DataTypes.STRING, allowNull: false },
        file_isdelete : {type: DataTypes.BOOLEAN, allowNull: false , defaultValue: '0'}
    }, {
            freezeTableName: true,
            tableName: "tbl_file",
            underscored: true,
            timestamps: true
        });
    file.associate = function (models) {
        file.belongsTo(models.blog, { foreignKey: 'blog_no' });
    };
    return file;
};