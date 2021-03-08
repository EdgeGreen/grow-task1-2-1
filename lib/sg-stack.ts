import {Construct, NestedStackProps} from '@aws-cdk/core';
import {Peer, Port, SecurityGroup, Vpc} from '@aws-cdk/aws-ec2'

import {BaseNestedStack} from './base-nested-stack';
import {sgStackConf} from './configuration/stacks-conf';


//------------------------------------------------------------------------------------------------------------
// *** IMPORTED RESOURSES ***
//------------------------------------------------------------------------------------------------------------
export interface sgStackProps extends NestedStackProps {
    readonly importedVpc: Vpc;
}

//------------------------------------------------------------------------------------------------------------
// *** SECURITY GROUPS STACK ***
//------------------------------------------------------------------------------------------------------------
export class SG extends BaseNestedStack {

    public readonly appSecurityGroup: SecurityGroup;
    public readonly bastionSecurityGroup: SecurityGroup;
    public readonly albSecurityGroup: SecurityGroup;
    
    constructor(scope: Construct, id: string, props: sgStackProps) {
        super(scope, id, props);        

//------------------------------------------------------------------------------------------------------------
// *** APP ***
//------------------------------------------------------------------------------------------------------------        
this.appSecurityGroup = new SecurityGroup(this, sgStackConf.appSecurityGroupName, {
    vpc: props.importedVpc,
    allowAllOutbound: true,
    securityGroupName: sgStackConf.appSecurityGroupName,
    description: sgStackConf.appSecurityGroupDescription
});

this.appSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(80), 'Allow input http connections');
this.appSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(22), 'Allow input ssh connections');

//------------------------------------------------------------------------------------------------------------
// *** BASTION ***
//------------------------------------------------------------------------------------------------------------ 
this.bastionSecurityGroup = new SecurityGroup(this, sgStackConf.bastionSecurityGroupName, {
    vpc: props.importedVpc,
    allowAllOutbound: true,
    securityGroupName: sgStackConf.bastionSecurityGroupName,
    description: sgStackConf.bastionSecurityGroupDescription
});

this.appSecurityGroup.addIngressRule(Peer.ipv4('0.0.0.0/0'), Port.tcp(22), 'Allow input ssh connections');

//------------------------------------------------------------------------------------------------------------
// *** APPLICATION LOAD BALANCER ***
//------------------------------------------------------------------------------------------------------------     
this.albSecurityGroup = new SecurityGroup(this, sgStackConf.albSecurityGroupName, {
    vpc: props.importedVpc,
    allowAllOutbound: true,
    securityGroupName: sgStackConf.albSecurityGroupName,
    description: sgStackConf.albSecurityGroupDescription
});

this.albSecurityGroup.addIngressRule(Peer.ipv4('0.0.0.0/0'), Port.tcp(80), 'Allow input http connections');

    }
} 