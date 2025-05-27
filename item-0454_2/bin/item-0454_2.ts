#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CommsQueuesStack } from '../lib/item-0454_2-stack';

const app = new cdk.App();
new CommsQueuesStack(app, 'CommsQueuesStack', {
  environment: "test"
});