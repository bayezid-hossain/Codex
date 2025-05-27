import * as cdk from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'my-dynamodb-stack');

// Create the DynamoDB table using CfnTable
const dynamoTable = new CfnTable(stack, 'MyCfnTable', {
  tableName: 'MyCfnDynamoTable',
  billingMode: 'PAY_PER_REQUEST',
  keySchema: [
    {
      attributeName: 'partitionKey',
      keyType: 'HASH'
    },
    {
      attributeName: 'sortKey',
      keyType: 'RANGE'
    }
  ],
  attributeDefinitions: [
    {
      attributeName: 'partitionKey',
      attributeType: 'S'
    },
    {
      attributeName: 'sortKey',
      attributeType: 'S'
    },
    {
      attributeName: 'gsiPartitionKey',
      attributeType: 'S'
    },
    {
      attributeName: 'gsiSortKey',
      attributeType: 'S'
    }
  ],
  globalSecondaryIndexes: [
    {
      indexName: 'myGSI',
      keySchema: [
        {
          attributeName: 'gsiPartitionKey',
          keyType: 'HASH'
        },
        {
          attributeName: 'gsiSortKey',
          keyType: 'RANGE'
        }
      ],
      projection: {
        projectionType: 'ALL'
      }
    }
  ]
});

// Add IAM permissions to allow an IAM principal to perform read/write operations
const role = new iam.Role(stack, 'TableAccessRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
});

// Define the table ARN manually since CfnTable doesn't provide it as a property
const tableArn = `arn:aws:dynamodb:${stack.region}:${stack.account}:table/${dynamoTable.tableName}`;
const indexArn = `${tableArn}/index/*`;

// Add policy to allow all read/write operations on the table
role.addToPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    'dynamodb:GetItem',
    'dynamodb:PutItem',
    'dynamodb:UpdateItem',
    'dynamodb:DeleteItem',
    'dynamodb:Query',
    'dynamodb:Scan',
    'dynamodb:BatchGetItem',
    'dynamodb:BatchWriteItem'
  ],
  resources: [tableArn, indexArn]
}));