import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { CfnTable } from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyDynamoDBTableStack');

// Define the DynamoDB table using CfnTable
export const cfnDynamoDBTable = new CfnTable(stack, 'MyCfnTable', {
  attributeDefinitions: [
    {
      attributeName: 'partitionKey',
      attributeType: 'S',
    },
    {
      attributeName: 'sortKey',
      attributeType: 'S',
    },
    {
      attributeName: 'gsiPartitionKey',
      attributeType: 'S',
    },
    {
      attributeName: 'gsiSortKey',
      attributeType: 'N',
    },
  ],
  keySchema: [
    {
      attributeName: 'partitionKey',
      keyType: 'HASH',
    },
    {
      attributeName: 'sortKey',
      keyType: 'RANGE',
    },
  ],
  provisionedThroughput: {
    readCapacityUnits: 5,
    writeCapacityUnits: 5,
  },
  tableName: 'MyCfnTableWithGSI',
  globalSecondaryIndexes: [
    {
      indexName: 'MyGlobalSecondaryIndex',
      keySchema: [
        {
          attributeName: 'gsiPartitionKey',
          keyType: 'HASH',
        },
        {
          attributeName: 'gsiSortKey',
          keyType: 'RANGE',
        },
      ],
      projection: {
        projectionType: 'ALL',
      },
      provisionedThroughput: {
        readCapacityUnits: 5,
        writeCapacityUnits: 5,
      },
    },
  ],
});

// Define an IAM principal (e.g., a Role)
const readWritePrincipal = new iam.Role(stack, 'ReadWriteRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'), // Replace with your principal
});

// Grant the IAM principal full DynamoDB data read/write access to this table
readWritePrincipal.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'dynamodb:BatchGetItem',
      'dynamodb:BatchWriteItem',
      'dynamodb:DeleteItem',
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:Query',
      'dynamodb:Scan',
      'dynamodb:UpdateItem',
    ],
    resources: [cfnDynamoDBTable.ref, `${cfnDynamoDBTable.ref}/index/*`], // Include table ARN and GSI ARNs
  })
);

// Output the table name and ARN
new cdk.CfnOutput(stack, 'TableName', {
  value: cfnDynamoDBTable.ref,
});

new cdk.CfnOutput(stack, 'TableArn', {
  value: cfnDynamoDBTable.getAtt('Arn').toString(),
});