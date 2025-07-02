const { Model , DataTypes} = require("sequelize");

class Users extends Model {}

const userSchema = {
    user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    linkedinurl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_dt: {
        type: DataTypes.NOW,
        defaultValue: DataTypes.NOW,
    },
    updated_dt: {
        type: DataTypes.NOW,
        defaultValue: DataTypes.NOW,
    },
    admin_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    domain_company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    assistant_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    signature_template: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}

module.exports = { userSchema, Users }
