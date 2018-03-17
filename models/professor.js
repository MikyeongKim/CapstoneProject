'use strict';
module.exports = (sequelize, DataTypes) => {
    var Professor = sequelize.define('Professor', {
        professor_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        professor_name: { type: DataTypes.STRING, allowNull: false, },
        professor_email: { type: DataTypes.STRING, unique: true },
        professor_phone: { type: DataTypes.STRING },
    }, {
            freezeTableName: true,
            tableName: "tbl_Professor",
            underscored: true,
            timestamps: true
        })
    Professor.associate = function (models) {
        Professor.belongsTo(models.User, { foreignKey: 'professor_no' });
        Professor.belongsTo(models.Department, { foreignKey: 'department_no' });
    };
    return Professor;
};