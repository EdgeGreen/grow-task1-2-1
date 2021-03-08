import {Construct, NestedStackProps} from '@aws-cdk/core';
import {SubnetType, Vpc} from '@aws-cdk/aws-ec2'

import {BaseNestedStack} from './base-nested-stack';
import {vpcStackConf} from './configuration/stacks-conf';

//------------------------------------------------------------------------------------------------------------
// *** VIRTUAL PRIVATE CLOUD STACK ***
//------------------------------------------------------------------------------------------------------------
export class VPC extends BaseNestedStack {

  public readonly exportedVPC: Vpc;
  
  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

//------------------------------------------------------------------------------------------------------------
// *** VIRTUAL PRIVATE CLOUD ***
//------------------------------------------------------------------------------------------------------------        
this.exportedVPC = new Vpc(this, vpcStackConf.vpcName, {

    cidr: '10.0.0.0/16',
    maxAzs: 2,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    natGateways: 0,

//------------------------------------------------------------------------------------------------------------
// *** PUBLIC SUBNETS ***
//------------------------------------------------------------------------------------------------------------          
    subnetConfiguration: [
      {
        subnetType: SubnetType.PUBLIC,
        name: vpcStackConf.publicSubnetsName,
        cidrMask: 24,
      },
      
//------------------------------------------------------------------------------------------------------------
// *** PRIVATE SUBNETS ***
//------------------------------------------------------------------------------------------------------------              
      { 
        subnetType: SubnetType.ISOLATED,
        name: vpcStackConf.privateSubnetsName,
        cidrMask: 24,     
      }
    ],
  });

    }
}
