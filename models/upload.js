'use strict';
module.exports = (sequelize, DataTypes) => {
    var Upload = sequelize.define('Upload', {
        Upload_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        Upload_title: { type: DataTypes.STRING, allowNull: false },
        Upload_location: { type: DataTypes.TEXT, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_upload",
            underscored: true,
            timestamps: true
        });
        Upload.associate = function (models) {
            Upload.belongsTo(models.Blog, { foreignKey: 'blog_no' });
        };
    return Upload;
};