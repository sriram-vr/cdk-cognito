import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import idpConfig, { ConfigEnvironmentType } from '../idps';
import { IdpConfigType } from '../idps/types';

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

          // ✅ Define the Lambda function
    const preTokenLambda = new lambda.Function(this, 'PreTokenGenerationLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/pre-token-generation')),
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      description: 'Pre Token Generation Lambda for Cognito',
    });

    // ✅ User Pool
    const userPoolFriendlyName = process.env.USER_POOL_FRIENDLY_NAME!;
    const userPoolName = process.env.USER_POOL_NAME!;
    const userPool = new cognito.UserPool(this, userPoolFriendlyName, {
      userPoolName: userPoolName,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: { required: true, mutable: true },
        familyName: { required: false, mutable: true },
        givenName: { required: false, mutable: true },
        middleName: { required: false, mutable: true },
        fullname: { required: false, mutable: true },
        nickname: { required: false, mutable: true },
        
      },
      customAttributes: {
        attribute1: new cognito.StringAttribute({ mutable: true }),
        attribute2: new cognito.StringAttribute({ mutable: true }),
        attribute3: new cognito.StringAttribute({ mutable: true }),
        attribute4: new cognito.StringAttribute({ mutable: true }),
        attribute5: new cognito.StringAttribute({ mutable: true }),
      },
      // advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // optional: to auto-delete on stack destroy
      lambdaTriggers: {
        preTokenGeneration: preTokenLambda
      }
    });

        //Create the SAML identity provider
    const getEnvironment = process.env.ENVIRONMENT!;
    let idps = (idpConfig as any)[getEnvironment];
    const supportedIdentityProviders = [];
    const samlProviderConstructs: cognito.CfnUserPoolIdentityProvider[] = [];
    if (!idps) {
      throw Error("No IDP found.");
    }
    for (const idp of idps) {
      const idpData: IdpConfigType = idp;
      const samlProvider = new cognito.CfnUserPoolIdentityProvider(this, idpData.identifierName, {
        providerName: idpData.providerName,
        providerType: idpData.providerType,
        userPoolId: userPool.userPoolId,
        providerDetails: {
          MetadataURL: idpData.metadataUrl,
        },
        attributeMapping: idpData.attributes
      });
    // Ensure user pool depends on the provider
    samlProviderConstructs.push(samlProvider);
    supportedIdentityProviders.push(cognito.UserPoolClientIdentityProvider.custom(idpData.providerName));
    }

    //App Client
    const callbackUrls = process.env.CALLBACK_URL! || '';
    const userPoolClientName = process.env.USER_POOL_CLIENT_NAME!;
    const appClient = userPool.addClient('AppClient', {
      userPoolClientName,
      generateSecret: false,
      authFlows: {
        userSrp: false,
        custom: false,
        adminUserPassword: false,
        userPassword: false,
        // refreshToken: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: [...callbackUrls.split(',').map(url => url.trim())],
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PHONE,
        ],
      },
      accessTokenValidity: cdk.Duration.minutes(60), // default is 60
      idTokenValidity: cdk.Duration.minutes(60),
      refreshTokenValidity: cdk.Duration.minutes(720),
      preventUserExistenceErrors: true,
      enableTokenRevocation: true,
      supportedIdentityProviders: [...supportedIdentityProviders]
    });
    
    for (const samlProvider of samlProviderConstructs) {
      appClient.node.addDependency(samlProvider);
    }

    cdk.Tags.of(userPool).add('Environment', getEnvironment);
    cdk.Tags.of(userPool).add('REGION', process.env.REGION!);
    cdk.Tags.of(userPool).add('Organization', 'Pristinedata');

    // Output the User Pool and Client ID
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'AppClientId', { value: appClient.userPoolClientId });
  }
}
