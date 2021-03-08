import { Construct, Stack, StackProps } from '@aws-cdk/core';
import {defaultsDeep} from "lodash";
import {baseStackConf} from './configuration/stacks-conf';


export class BaseStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        let properties = defaultsDeep({}, props, {
            tags: {
                'Envirement': baseStackConf.Envirement
           
            },

            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT, 
                region: process.env.CDK_DEFAULT_REGION 
            }
        });

        super(scope, id, properties);

    }
}
