const { Accounts, accountsSchema } = require("../model/Accounts");
const { ADGroup, adgroupSchema } = require("../model/Adgroups");
const { Roles, roleSchema } = require("../model/Role");
const { userSchema, Users } = require("../model/Users");

function initializeSchema (sequelize) {
    if (!sequelize) { return; }
        Accounts.init(accountsSchema, {
            sequelize,
            modelName: 'Accounts',
            tableName: 'accounts',
            timestamps: false,
        });

        ADGroup.init(adgroupSchema, {
            sequelize,
            modelName: 'ADGroup',
            tableName: 'adgroup_roles',
            timestamps: false,
        });

        Roles.init(roleSchema, {
            sequelize,
            modelName: 'Roles',
            tableName: 'roles',
            timestamps: false,
        })


        Users.init(userSchema, {
            sequelize,
            modelName: 'Users',
            tableName: 'users',
            timestamps: false,
        });

        Users.belongsTo(Accounts, {
            foreignKey:'account_id',
            as:'accounts'
        });

        ADGroup.belongsTo(Roles, {
            foreignKey: 'roles_id',
            as: 'roles'
        });
}

module.exports = { initializeSchema }