/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qrcode_info', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    SerialId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    IdentifyCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    FirstTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    QueryCount: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    Member: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'qrcode_info'
  });
};
