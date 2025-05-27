import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface CommsQueuesStackProps extends cdk.StackProps {
  environment: string
}

export class CommsQueuesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CommsQueuesStackProps) {

    super(scope, id, props);

    const queues = [
      { name: 'CommsInboundMessages', 'key': 'inbound-messages' },
      { name: 'CommsDriverSatCMarlinkCommands', 'key': 'satc-marlink-commands' },
      { name: 'CommsDriverSatCInmarsatCommands', 'key': 'satc-inmarsat-commands' },
      { name: 'CommsDriverIridiumCommands', 'key': 'iridium-commands' },
      { name: 'CommsConsumerUncleFred', 'key': 'consumer-uncle-fred' },
      { name: 'CommsDriverLarsthraneCommands', 'key': 'larsthrane-commands' },
      { name: 'CommsDriverSkyWaveCommands', 'key': 'skywave-commands' },
      { name: 'CommsDriverIridiumCertusCommands', 'key': 'iridiumcertus-commands' },
      { name: 'CommsConsumerMCP', 'key': 'comms-to-mcp' },
      { name: 'CommsInboundMessagesQueue', 'key': 'inbound-messages-queue' },
      { name: 'CommsDriverSatCCommands', 'key': 'satc-commands' }
    ]

    for (let queue of queues) {
      // Check if this is the queue we want to make FIFO
      const isFifoQueue = queue['name'] === 'CommsDriverSatCCommands';

      const q = new sqs.Queue(this, queue['name'], {
        // For FIFO queue, set fifoQueue to true and add .fifo suffix to name

        fifoQueue: isFifoQueue,
        queueName: isFifoQueue ? `${queue['name']}.fifo` : undefined,
        // You might also want to set contentBasedDeduplication for FIFO queue
        contentBasedDeduplication: isFifoQueue ? true : false,
      });

      // Rest of your code remains the same
      new ssm.StringParameter(this, queue['name'] + "Name", {
        stringValue: q.queueName,
        parameterName: `/${props!.environment}/comms/${queue['key']}-queue-name`
      })
    }

    // PurpleTRAC queue
    const qNameSuffix = "CommsConsumer-purpletrac"
    new sqs.Queue(this, qNameSuffix, {
      queueName: `${id}-${qNameSuffix}`
    });
  }
}