'use strict';
module.exports = (sequelize, DataTypes) => {
    var Category = sequelize.define('Category', {
        category_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        category_name: {
            type: DataTypes.STRING, allowNull: false, unique: true },
    }, {
            freezeTableName: true,
            tableName: "tbl_category",
            underscored: true,
            timestamps: false
        });
    Category.associate = function (models) {
        //Category.hasMany(models.Board, { foreignKey: 'board_category', sourceKey: 'category_no' });
        
    };
    return Category;
};