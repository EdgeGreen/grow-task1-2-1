#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');

import { ParentStack } from '../lib/parent-stack';
import {baseStackConf } from '../lib/configuration/stacks-conf';


const app = new cdk.App();

new ParentStack(app, 'ParentStack', {
    env: { 
        region: baseStackConf.region 
    }
});

app.synth();
