import {Construct, NestedStackProps, RemovalPolicy} from '@aws-cdk/core';
import autoscaling = require('@aws-cdk/aws-autoscaling');
import { Bucket, BlockPublicAccess } from '@aws-cdk/aws-s3';

import {BaseNestedStack} from './base-nested-stack';
import {s3StackConf} from './configuration/stacks-conf';

// ------------------------------------------------------------------------------------------------------------
// *** IMPORTED RESOURSES ***
// ------------------------------------------------------------------------------------------------------------
export interface s3StackProps extends NestedStackProps {
    importedASG: autoscaling.AutoScalingGroup;
}

//------------------------------------------------------------------------------------------------------------
// *** S3 BUCKET STACK ***
//------------------------------------------------------------------------------------------------------------
export class S3 extends BaseNestedStack {

    readonly s3: Bucket;
    
    constructor(scope: Construct, id: string, props: s3StackProps) {
        super(scope, id, props);


// export class S3 extends core.NestedStack {

//   public readonly s3: Bucket;

//   constructor(scope: Construct, id: string, props?: core.NestedStackProps) {
//     super(scope, id, props);        
//------------------------------------------------------------------------------------------------------------
// *** S3 BUCKET ***
//------------------------------------------------------------------------------------------------------------        
this.s3 = new Bucket(this, s3StackConf.bucketName, {
    bucketName: s3StackConf.bucketName,
    // encryption: BucketEncryption.KMS_MANAGED,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    versioned: true,
});

// now you can just call methods on the bucket
this.s3.grantReadWrite(props.importedASG);
      
  }
} 