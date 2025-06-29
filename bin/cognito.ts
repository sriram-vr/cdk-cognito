#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito-stack';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.USER_POOL_FRIENDLY_NAME || !process.env.USER_POOL_NAME || !process.env.CALLBACK_URL ||
    !process.env.ENVIRONMENT || !process.env.USER_POOL_CLIENT_NAME || !process.env.REGION || !process.env.VPC_ID ||
    !process.env.AWS_ACCOUNT || !process.env.SUBNET1 || !process.env.SUBNET2 || !process.env.ROUTE_TABLE1 || !process.env.ROUTE_TABLE2 ||
    !process.env.SUBNET1_AVAILABILITY_ZONE || !process.env.SUBNET2_AVAILABILITY_ZONE) {
    throw Error("Missing environment variables.");
}

const app = new cdk.App();

const cognitoStackName = process.env.ENVIRONMENT! + '-pristinedata-cognito-stack'

new CognitoStack(app, cognitoStackName, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: process.env.AWS_ACCOUNT!, region: process.env.REGION! },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  },);