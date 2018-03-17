'use strict';
module.exports = (sequelize, DataTypes) => {
    var Manager = sequelize.define('Manager', {
        manager_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        manager_name: { type: DataTypes.STRING, allowNull: false, },
        manager_email: { type: DataTypes.STRING, unique: true },
        manager_phone: { type: DataTypes.STRING },
    }, {
            freezeTableName: true,
            tableName: "tbl_manager",
            underscored: true,
            timestamps: true
        })
    Manager.associate = function (models) {
        Manager.belongsTo(models.User, { foreignKey: 'manager_no' });
        Manager.belongsTo(models.Department, { foreignKey: 'department_no' });
    };
    return Manager;
};