const { Op } = require("sequelize");
const { ADGroup } = require("../model/Adgroups");
const { Roles } = require("../model/Role");

async function getAdGroup(adgroupArray) {
    try {
        if (!adgroupArray) { return null; }
        const getGroups = await ADGroup.findOne({where: { adgroup : { [Op.in] : adgroupArray } }, order: [['roles_id', 'ASC']], include: [{ model: Roles, as: 'roles' }]});
        return getGroups?.dataValues;
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = { getAdGroup }