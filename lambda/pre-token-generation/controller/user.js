const { Users } = require("../model/Users");
const { Accounts } = require("../model/Accounts");
const { Op, fn, col, where } = require('sequelize');

async function getUser(email) {
    try {
        if (!email) { throw Error("No email to fetch user."); }
        const user = await Users.findOne({
            where: where(fn('LOWER', col('user_email')), {
                [Op.eq]: email.toLowerCase()
            }),
            include: [
                { model: Accounts, as: 'accounts' }
            ]
        });
        return user?.dataValues || null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function createUser(payload = {}) {
    try {
        if (!Object.keys(payload).length === 0) { throw Error("No payload to create user."); }
        console.log("Proceed to create the user");
        const user = await Users.create(payload);
        console.log("User has been created.");
        return user?.dataValues;
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = { getUser, createUser }