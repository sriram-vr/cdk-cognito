import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import idpConfig from '../idps';
import { IdpConfigType } from '../idps/types';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* Add VPC to Cognito. Required for DB access. */
    const vpc = ec2.Vpc.fromLookup(this, 'cognitoVPC', {
      vpcId: process.env.VPC_ID!,
    });
    const subnet1 = ec2.Subnet.fromSubnetAttributes(this, 'Subnet1', {
        subnetId: process.env.SUBNET1!,
        availabilityZone: process.env.SUBNET1_AVAILABILITY_ZONE!,
        routeTableId: process.env.ROUTE_TABLE1!
      });
    
    const subnet2 = ec2.Subnet.fromSubnetAttributes(this, 'Subnet2', {
      subnetId: process.env.SUBNET2!,
      availabilityZone: process.env.SUBNET2_AVAILABILITY_ZONE!,
      routeTableId: process.env.ROUTE_TABLE2!
    });

    const LAMBDA_NAME = process.env.ENVIRONMENT! + '-cognito-pre-token-generation-lambda';

    // ✅ Define the Lambda function
    const preTokenLambda = new lambda.Function(this, 'PreTokenGenerationLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/pre-token-generation')),
      memorySize: 128,
      timeout: cdk.Duration.seconds(60),
      description: 'Pre Token Generation Lambda for Cognito',
      functionName: LAMBDA_NAME,
      vpc,
      vpcSubnets: {
        subnets: [subnet1, subnet2]
      },
      allowPublicSubnet: true,
      environment: {
        DB_SECRET_NAME: process.env.DB_SECRET_NAME!
      },
    });

    /* Add the IAM role to use VPC. */
    preTokenLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ec2:CreateNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DeleteNetworkInterface'
      ],
      resources: ['*'],
    }));

    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'CognitoLambdaSecretManagerAccess', process.env.DB_SECRET_NAME!);
    secret.grantRead(preTokenLambda);

    /* Update User Pool details. */
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
      },
    });

    userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: process.env.USER_POOL_NAME! + 'ai',
      }
    });

    // use addOverride to inject LambdaVersion V2_0
    const cfn = userPool.node.defaultChild as cognito.CfnUserPool;
    cfn.addOverride('Properties.LambdaConfig.PreTokenGenerationConfig', {
      LambdaArn: preTokenLambda.functionArn,
      LambdaVersion: 'V2_0',
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
      accessTokenValidity: cdk.Duration.minutes(15), // default is 60
      idTokenValidity: cdk.Duration.minutes(15),
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
