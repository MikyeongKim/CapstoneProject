'use strict';
module.exports = (sequelize, DataTypes) => {
    var Signupsubject = sequelize.define('Signupsubject', {
        signupsubject_time: { type: DataTypes.STRING, allowNull: false },
    }, {
            freezeTableName: true,
            tableName: "tbl_signupsubject",
            underscored: true,
            timestamps: true
        });
    Signupsubject.associate = function (models) {
        Signupsubject.belongsTo(models.Subject, { foreignKey: 'signup_subject_no' });
        Signupsubject.belongsTo(models.User, { foreignKey: 'signup_user_no' });
    };
    return Signupsubject;
};