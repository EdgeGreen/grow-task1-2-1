#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import {VPC} from '../lib/vpc-stack';
import {SG} from '../lib/sg-stack';
import {ASG} from '../lib/asg-stack';
import {ALB} from '../lib/alb-stack';
import { S3 } from '../lib/s3-stack';
import { ParentStack } from '../lib/parent-stack';
import {vpcStackConf, sgStackConf, asgStackConf, albStackConf, s3StackConf, baseStackConf } from '../lib/configuration/stacks-conf';


const app = new cdk.App();

new ParentStack(app, 'ParentStack', {
    env: { 
        region: baseStackConf.region 
    }
});

app.synth();
