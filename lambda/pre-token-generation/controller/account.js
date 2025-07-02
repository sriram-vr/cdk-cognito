const { Accounts } = require("../model/Accounts");

async function getAccount(domain) {
    try {
        if (!domain) { return null; }
        const account = await Accounts.findOne({  where: { domain_name : domain }});
        console.log("account");
        console.log(account);
        return account?.dataValues;
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = { getAccount }