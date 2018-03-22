'use strict';
module.exports = (sequelize, DataTypes) => {
    var Board = sequelize.define('Board', {
        board_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        board_title: { type: DataTypes.STRING, allowNull: false },
        board_content: { type: DataTypes.TEXT, allowNull: false },
        board_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: '0' },
    }, {
            freezeTableName: true,
            tableName: "tbl_board",
            underscored: true,
            timestamps: true
        });
    Board.associate = function (models) {
        Board.belongsTo(models.User, { foreignKey: 'board_user_no' });
        Board.belongsTo(models.Category, { foreignKey: 'board_category' });
        Board.belongsTo(models.Department, { foreignKey: 'board_department' });
        Board.hasMany(models.Reply, { foreignKey: 'board_no', sourceKey: 'board_no' });
    };
    return Board;
};