'use strict';
module.exports = (sequelize, DataTypes) => {
    var blog = sequelize.define('blog', {
        blog_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        blog_title: { type: DataTypes.STRING, allowNull: false },
        blog_content: { type: DataTypes.TEXT, allowNull: false },
        blog_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: '0' },
        blog_writer: { type: DataTypes.STRING, allowNull: false },
        blog_ispublic : {type: DataTypes.BOOLEAN, allowNull: false , defaultValue: '1'}
          }, {
            freezeTableName: true,
            tableName: "tbl_blog",
            underscored: true,
            timestamps: true
        });
    blog.associate = function (models) {
        blog.belongsTo(models.User, { foreignKey: 'blog_user_no' });
        blog.belongsTo(models.Category, { foreignKey: 'blog_category' });
        blog.belongsTo(models.subject, { foreignKey: 'subject_no' });
    };
    return blog;
};
