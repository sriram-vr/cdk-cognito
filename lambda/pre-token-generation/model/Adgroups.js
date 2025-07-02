const { Model, DataTypes } = require("sequelize");

class ADGroup extends Model { }

const adgroupSchema = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    adgroup: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roles_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_dt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    modified_dt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}

module.exports = { adgroupSchema, ADGroup }