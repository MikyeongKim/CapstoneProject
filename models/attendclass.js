'use strict';
module.exports = (sequelize, DataTypes) => {
    var attendclass = sequelize.define('attendclass', {
        score1: { type: DataTypes.INTEGER },
        score2: { type: DataTypes.INTEGER },
        score3: { type: DataTypes.INTEGER },
        score4: { type: DataTypes.INTEGER },
        score5: { type: DataTypes.INTEGER },
        score6: { type: DataTypes.INTEGER },
        score7: { type: DataTypes.INTEGER },
        score8: { type: DataTypes.INTEGER },
        score9: { type: DataTypes.INTEGER },
        score10: { type: DataTypes.INTEGER },
    }, {
            freezeTableName: true,
            tableName: "tbl_attendclass",
            underscored: true,
            timestamps: false
        })
    attendclass.associate = function (models) {
    }
    return attendclass;
};