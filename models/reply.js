'use strict';
module.exports = (sequelize, DataTypes) => {
    var Reply = sequelize.define('Reply', {
        reply_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        reply_content: { type: DataTypes.STRING, allowNull: false },
        reply_writer: { type: DataTypes.STRING, allowNull: false }
    }, {
            freezeTableName: true,
            tableName: "tbl_reply",
            underscored: true,
            timestamps: true
        });
        
        Reply.associate = function (models) {
        Reply.belongsTo(models.User, { foreignKey: 'board_user_no' });
        Reply.belongsTo(models.Board, { foreignKey: 'subjectType_no' });
    };
    return Reply;
};