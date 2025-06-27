export const handler = async function(event, context) {
  console.log('Inside handler function...');
  console.log('event');
  console.log(event);
  console.log('context');
  console.log(context);
  // const initDB = await sequelize.authenticate();
  event.response = {
    "claimsAndScopeOverrideDetails": {
      "accessTokenGeneration": {
        "claimsToAddOrOverride": {
          "custom:profileAndRoleInformation": {
            "user_id": 61,
            "user_email": "sriram@pristinedata.ai",
            "role": "super_user",
            "account_id": 12,
            "role_id": 1,
            "assistant_id": "{\"EMAIL_ASSISTANT\":\"asst_7lVCQolW5W78mJozQ7V6FJQ2\",\"SOLUTION_ASSISTANT\":\"asst_ym042EgrM2j63M294eJA9O8h\"}"
          }
        }
      }
    }
  };
  context.done(null, event);
}