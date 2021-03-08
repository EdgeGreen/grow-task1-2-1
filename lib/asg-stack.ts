import {Construct, NestedStackProps} from '@aws-cdk/core';
import {SecurityGroup, Vpc} from '@aws-cdk/aws-ec2'
import autoscaling = require('@aws-cdk/aws-autoscaling');
import {Metric } from '@aws-cdk/aws-cloudwatch';
import ec2 = require('@aws-cdk/aws-ec2');
import { KeyPair } from 'cdk-ec2-key-pair';

import {BaseNestedStack} from './base-nested-stack';
import {asgStackConf} from './configuration/stacks-conf';

//------------------------------------------------------------------------------------------------------------
// *** IMPORTED RESOURSES ***
//------------------------------------------------------------------------------------------------------------
export interface asgStackProps extends NestedStackProps {
    importedVpc: Vpc;
    importedAsgSecurityGroup: SecurityGroup
    importedBastionSecurityGroup: SecurityGroup
}

//------------------------------------------------------------------------------------------------------------
// *** AUTO SCALING GROUP STACK ***
//------------------------------------------------------------------------------------------------------------
export class ASG extends BaseNestedStack {

    readonly app: autoscaling.AutoScalingGroup;
    readonly bastion: autoscaling.AutoScalingGroup;
    
    constructor(scope: Construct, id: string, props: asgStackProps) {
        super(scope, id, props);

//------------------------------------------------------------------------------------------------------------
// *** SSH KEY PAIR ***
//------------------------------------------------------------------------------------------------------------
// const key = new KeyPair(this, asgStackConf.kerPairName, {
//      name: asgStackConf.kerPairName,
//      description: asgStackConf.kerPairNameDescription,
//      storePublicKey: true,
// });

//------------------------------------------------------------------------------------------------------------
// *** APP ***
//------------------------------------------------------------------------------------------------------------
this.app = new autoscaling.AutoScalingGroup(this, asgStackConf.appName, {
      minCapacity: 2,
      maxCapacity: 6,
      vpc: props.importedVpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.genericLinux({'us-east-1': 'ami-0885b1f6bd170450c'}),
      securityGroup: props.importedAsgSecurityGroup,
    });

//------------------------------------------------------------------------------------------------------------
// *** APP USERDATA ***
//------------------------------------------------------------------------------------------------------------    
this.app.userData.addCommands(
     'apt-get update -y',
     'apt-get install awscli -y',
     'INSTANCE_IP=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)',
     'echo "<h1>$INSTANCE_IP</h1>" > index.html',
     'nohup busybox httpd -f -p 80 &',
     'echo "*/1 * * * * aws s3 cp /index.html s3://growprj-s3-web-bk-unique/index.html" > /tmp/mycrontab.txt',
     'bash -c "crontab /tmp/mycrontab.txt"'
);
  
//------------------------------------------------------------------------------------------------------------
// *** APP SCALING METRIC ***
//------------------------------------------------------------------------------------------------------------
const workerUtilizationMetric = new Metric({
    namespace: 'MyService',
    metricName: 'WorkerUtilization'
});
  
this.app.scaleOnMetric('ScaleToCPU', {
    metric: workerUtilizationMetric,
    scalingSteps: [
      { upper: 10, change: -1 },
      { lower: 50, change: +1 },
      { lower: 70, change: +2 },
    ],

    // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
    // 'change' numbers before as percentages instead of capacity counts.
    adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
});

//------------------------------------------------------------------------------------------------------------
// *** BASTION ***
//------------------------------------------------------------------------------------------------------------
this.bastion = new autoscaling.AutoScalingGroup(this, 'bastion', {
    minCapacity: 1,
    maxCapacity: 1,
    vpc: props.importedVpc,
    vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC
    },
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.genericLinux({'us-east-1': 'ami-0885b1f6bd170450c'}),
    securityGroup: props.importedAsgSecurityGroup,
    // keyName: key.keyPairName,
});
//------------------------------------------------------------------------------------------------------------
// *** APP SCALING METRIC ***
//------------------------------------------------------------------------------------------------------------  
const workerUtilizationMetric2 = new Metric({
    namespace: 'MyService2',
    metricName: 'WorkerUtilization2'
});

this.bastion.scaleOnMetric('ScaleToCPU2', {
    metric: workerUtilizationMetric,
    scalingSteps: [
      { upper: 10, change: -1 },
      { lower: 50, change: +1 },
      { lower: 70, change: +2 },
    ],

    // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
    // 'change' numbers before as percentages instead of capacity counts.
    adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
});

  }
} 