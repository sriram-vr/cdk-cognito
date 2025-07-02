const { Model , DataTypes} = require("sequelize");

class Roles extends Model {}

const roleSchema =  {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  role_display_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}

module.exports = { Roles, roleSchema }