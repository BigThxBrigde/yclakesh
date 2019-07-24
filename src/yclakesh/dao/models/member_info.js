/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('member_info', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    member_info: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    Certfication: {
      type: "BLOB",
      allowNull: false
    }
  }, {
    tableName: 'member_info'
  });
};
