import { Construct, StackProps } from '@aws-cdk/core';

import {VPC} from './vpc-stack';
import {SG} from './sg-stack';
import {ASG} from './asg-stack';
import {ALB} from './alb-stack';
import { S3} from './s3-stack';
import {vpcStackConf, sgStackConf, asgStackConf, albStackConf, s3StackConf } from './configuration/stacks-conf'
import {BaseStack} from './base-stack';

//------------------------------------------------------------------------------------------------------------
// *** PARENT STACK FOR NESTED STACKS ***
//------------------------------------------------------------------------------------------------------------
export class ParentStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

//------------------------------------------------------------------------------------------------------------
// *** VIRTUAL PRIVATE CLOUD STACK ***
//------------------------------------------------------------------------------------------------------------
const vpcStack = new VPC(this, vpcStackConf.stackName);

//------------------------------------------------------------------------------------------------------------
// *** SECURITY GROUPS STACK ***
//------------------------------------------------------------------------------------------------------------
const sgStack = new SG(this, sgStackConf.stackName, {
    importedVpc: vpcStack.exportedVPC,
});

//------------------------------------------------------------------------------------------------------------
// *** AUTO SCALING GROUP STACK ***
//------------------------------------------------------------------------------------------------------------
const asgStack = new ASG(this, asgStackConf.stackName, {

  importedVpc: vpcStack.exportedVPC,

  importedAsgSecurityGroup: sgStack.appSecurityGroup,

  importedBastionSecurityGroup: sgStack.bastionSecurityGroup
});

//------------------------------------------------------------------------------------------------------------
// *** APPLICATION LOAD BALANCER STACK ***
//------------------------------------------------------------------------------------------------------------
const albStack = new ALB(this, albStackConf.stackName, {

  importedVpc: vpcStack.exportedVPC,

  importedAlbSecurityGroup: sgStack.albSecurityGroup,

  importedASG: asgStack.app

});

//------------------------------------------------------------------------------------------------------------
// *** S3 BUCKET STACK ***
//------------------------------------------------------------------------------------------------------------
const s3Stack = new S3(this, s3StackConf.stackName, {
  
  importedASG: asgStack.app

});

  }
}