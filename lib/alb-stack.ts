import {Construct, NestedStackProps, Duration} from '@aws-cdk/core';
import {SecurityGroup, Vpc} from '@aws-cdk/aws-ec2'
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationListener, ListenerAction } from '@aws-cdk/aws-elasticloadbalancingv2';

import {BaseNestedStack} from './base-nested-stack';
import {albStackConf} from './configuration/stacks-conf';

//------------------------------------------------------------------------------------------------------------
// *** IMPORTED RESOURSES ***
//------------------------------------------------------------------------------------------------------------
export interface albStackProps extends  NestedStackProps {
    importedVpc: Vpc;
    importedAlbSecurityGroup: SecurityGroup;
    importedASG: autoscaling.AutoScalingGroup;
}

//------------------------------------------------------------------------------------------------------------
// *** APPLICATION LOAD BALANCER STACK ***
//------------------------------------------------------------------------------------------------------------
export class ALB extends BaseNestedStack {

    readonly asg1: autoscaling.AutoScalingGroup;
    readonly asg2: autoscaling.AutoScalingGroup;
    
    constructor(scope: Construct, id: string, props: albStackProps) {
        super(scope, id, props);

//------------------------------------------------------------------------------------------------------------
// *** APPLICATION LOAD BALANCER ***
//------------------------------------------------------------------------------------------------------------
const loadBalancer = new ApplicationLoadBalancer(this, albStackConf.loadBalancerName, {
    loadBalancerName: albStackConf.loadBalancerName,
    vpc: props.importedVpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PUBLIC
    },
    securityGroup: props.importedAlbSecurityGroup,
    idleTimeout: Duration.seconds(30),
    internetFacing: true,
    deletionProtection: false
  });

//------------------------------------------------------------------------------------------------------------
// *** APPLICATION LOAD BALANCER LISTENER ***
//------------------------------------------------------------------------------------------------------------
const listenerHttp = new ApplicationListener(this, albStackConf.listenerHttpName, {
    loadBalancer: loadBalancer,
    port: 80,
    protocol: ApplicationProtocol.HTTP,
    open: false,
    defaultAction: ListenerAction.redirect({
      host: '#{host}',
      path: '/#{path}',
      port: '80',
      protocol: 'HTTP',
      query: '#{query}',
      permanent: true
   })
});

listenerHttp.addTargets(albStackConf.listenerHttpTargetsName, {
    port: 80,
    targets: [props.importedASG],
    healthCheck: {
        enabled: true,
    }
});

  }
} 