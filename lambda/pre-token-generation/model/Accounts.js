const { Model, DataTypes } = require("sequelize");

class Accounts extends Model { }

const accountsSchema = {
    account_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    account_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    linkedin_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    timezone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    db_host: {
        type: DataTypes.STRING,
        allowNull: true
    },
    db_port: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    db_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    db_user: {
        type: DataTypes.STRING,
        allowNull: true
    },
    db_password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    domain_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    modified_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    account_plan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    plan_credits: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    credits_remaining: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payment_details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    enrollment_dt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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

module.exports = { accountsSchema, Accounts }