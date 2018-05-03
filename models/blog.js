'use strict';
module.exports = (sequelize, DataTypes) => {
    var Blog = sequelize.define('Blog', {
        blog_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        blog_title: { type: DataTypes.STRING, allowNull: false },
        blog_content: { type: DataTypes.TEXT, allowNull: false },
        blog_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: '0' },
        blog_writer: { type: DataTypes.STRING, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_blog",
            underscored: true,
            timestamps: true
        });

    Blog.associate = function (models) {
        Blog.belongsTo(models.User, { foreignKey: 'blog_user_no' });
        Blog.belongsTo(models.Subject, { foreignKey: 'blog_subject_no' });
        Blog.belongsTo(models.Category, { foreignKey: 'blog_category' });
    };
    return Blog;
};