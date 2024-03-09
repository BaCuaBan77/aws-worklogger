import * as cdk from "aws-cdk-lib";
import {
  ApiKey,
  ApiKeySourceType,
  Cors,
  LambdaIntegration,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsWorkhourStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsWorkhourQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Define DynamoDB table
    const workHourTable = new Table(this, "WorkHourTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // Define Gateway API
    const api = new RestApi(this, "RestApi", {
      restApiName: "RestAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    // Define the API key
    const apiKey = new ApiKey(this, "ApiKey");

    // Define the Usage Plan
    const usagePlan = new UsagePlan(this, "UsagePlan", {
      name: "Usage Plan",
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    });

    // Add the Api Key to the Usage Plan
    usagePlan.addApiKey(apiKey);

    // Define Lambda Functions for the work hour
    const workHourLambda = new NodejsFunction(this, "WorkHourLambda", {
      entry: "resources/endpoints/workhour.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: workHourTable.tableName,
      },
    });

    const workHoursLambda = new NodejsFunction(this, "WorkHoursLambda", {
      entry: "resources/endpoints/workhours.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: workHourTable.tableName,
      },
    });
    workHourTable.grantReadWriteData(workHourLambda);
    workHourTable.grantReadWriteData(workHoursLambda);

    const updateWorkHours = api.root.addResource("workhours");
    const getManyWorkHours = updateWorkHours.addResource("{username}");
    const getOneWorkHours = getManyWorkHours.addResource("{date}");

    const workHourIntegration = new LambdaIntegration(workHourLambda);
    const workHoursIntegration = new LambdaIntegration(workHoursLambda);

    updateWorkHours.addMethod("POST", workHourIntegration, {
      apiKeyRequired: true,
    });
    updateWorkHours.addMethod("DELETE", workHourIntegration, {
      apiKeyRequired: true,
    });
    getManyWorkHours.addMethod("GET", workHoursIntegration, {
      apiKeyRequired: true,
    });
    getOneWorkHours.addMethod("GET", workHourIntegration, {
      apiKeyRequired: true,
    });

    new cdk.CfnOutput(this, "API Key ID", {
      value: apiKey.keyId,
    });
  }
}
