'use strict';
module.exports = (sequelize, DataTypes) => {
    var Editlog = sequelize.define('Editlog', {
        edit_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        edit_filepath: { type: DataTypes.STRING, },
        edit_lang: { type: DataTypes.STRING, },
        edit_filename: { type: DataTypes.STRING, },
        edit_file_origen_name: { type: DataTypes.STRING,},
        edit_isSuccess : { type: DataTypes.BOOLEAN}
    }, {
            freezeTableName: true,
            tableName: "tbl_edit_log",
            underscored: true,
            timestamps: true
        });
        
        Editlog.associate = function (models) {
        Editlog.belongsTo(models.User, { foreignKey: 'edit_user_no' });
    };
    return Editlog;
};