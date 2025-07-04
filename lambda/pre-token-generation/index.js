
const { initDB } = require('./config/db');
const { getUser, createUser } = require('./controller/user');
const { getAccount } = require('./controller/account');
const { fetchGroups } = require('./utils/helper');
const { getAdGroup } = require('./controller/adgroup');

const handler = async function(event, context) {
  try {
  console.log('Entering handler function..');
  console.log('event:', JSON.stringify(event));
  await initDB();
  const email = event?.request?.userAttributes?.email;
  if (!email) {
      throw Error('Email not found in request!')
  }
  let user = await getUser(email);
  if (!user || !user.user_email) {
      /* Code for cognito. */
      if (!event.request?.userAttributes?.["custom:attribute1"]) {
          throw Error("No account associated for the user in IDP.");
      }
      /* Check if we really need to use custom:attribute1 or any best solution. */
      const account = await getAccount(event.request.userAttributes["custom:attribute1"]);
      if (!account?.account_id) {
          throw Error("No account associated for the domain.");
      }
      console.log('Proceed to create new account for the user.');
      const groups = event.request.userAttributes['custom:groups'];
      let role_id;
      let roleName;
      if (groups) {
          const gp = fetchGroups(groups);
          const getPriorityADGroup = await getAdGroup(gp);
          if (getPriorityADGroup?.roles?.dataValues?.role_id) {
              role_id = getPriorityADGroup.roles?.dataValues.role_id;
              roleName = getPriorityADGroup.roles?.dataValues?.role_name;
          }
      }
      const userPayload = {
          user_name: event.request.userAttributes.name,
          user_email: event.request.userAttributes.email.toLowerCase(),
          role_id: role_id || 5,
          role_name: roleName || 'starter_user',
          password: 'sso_temp',
          is_active: true,
          created_dt: new Date(),
          updated_dt: new Date(),
          account_id: account.account_id,
          company: account.company || null,
          domain_company: null, // Need custom IDP attribute
          first_name: event.request.userAttributes.given_name,
          last_name: event.request.userAttributes.family_name,
          assistant_id: null, // TODO: Check if required.
          contact_number: null,
          signature_template: null,
      }
      user = await createUser(userPayload);
      if (!user || !user.user_id) {
          throw Error("Unable to create user.");
      }
  }
  if (!user.accounts?.account_id && !user.account_id) {
      throw Error("No account associated for the user.");
  }
  const profileInformation = {
      user_id: user.user_id,
      user_email: user.user_email,
      role: user.role_name,
      account_id: user.accounts?.account_id || user.account_id,
      role_id: user.role_id || null,
      assistant_id: user.assistant_id || null
  }

  event.response = {
    "claimsAndScopeOverrideDetails": {
      "accessTokenGeneration": {
        "claimsToAddOrOverride": {
          "profileAndRoleInformation": {...profileInformation}
        }
      }
    }
  };
  } catch (err) {
    console.log(err);
    throw err;
  }
  context.done(null, event);
}

module.exports = { handler };