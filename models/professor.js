'use strict';
module.exports = (sequelize, DataTypes) => {
    var Professor = sequelize.define('Professor', {
        professor_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        professor_name: { type: DataTypes.STRING, allowNull: false, },
    }, {
            freezeTableName: true,
            tableName: "tbl_Professor",
            underscored: true,
            timestamps: true
        })
    Professor.associate = function (models) {
        Professor.belongsTo(models.User, { foreignKey: 'professor_no' });
        Professor.hasMany(models.subject, { sourceKey: 'professor_no' , foreignKey: 'professor_no' });
    };
    return Professor;
};