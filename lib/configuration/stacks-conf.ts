
const namePrefix = 'growPrj';


export const baseStackConf = {
//------------------------------------------------------------------------------------------------------------
// *** Tags/Metadata ***
//------------------------------------------------------------------------------------------------------------    
  "Envirement": "Env1",
}

//------------------------------------------------------------------------------------------------------------
// *** VIRTUAL PRIVATE CLOUD STACK ***
//------------------------------------------------------------------------------------------------------------
export const vpcStackConf = {
  region: "us-east-1",
  stackName: `${namePrefix}-VPC`,

  vpcName: `${namePrefix}-VPC`,
  publicSubnetsName: `${namePrefix}-Public`,
  privateSubnetsName: `${namePrefix}-Private`
}

//------------------------------------------------------------------------------------------------------------
// *** SECURITY GROUPS STACK ***
//------------------------------------------------------------------------------------------------------------
export const sgStackConf = {
  region: "us-east-1",
  stackName: `${namePrefix}-SG`,

  appSecurityGroupName: `${namePrefix}-SG app`,
  appSecurityGroupDescription: `${namePrefix}-Sg-for-ASG-app`,

  bastionSecurityGroupName: `${namePrefix}-SG-bastion`,
  bastionSecurityGroupDescription: `${namePrefix}-Sg-for-ASG-bastion`,

  albSecurityGroupName: `${namePrefix}-SG alb`,
  albSecurityGroupDescription: `${namePrefix}-Sg-for-ALB`,
}

//------------------------------------------------------------------------------------------------------------
// *** AUTO SCALING GROUP STACK ***
//------------------------------------------------------------------------------------------------------------
export const asgStackConf = {
  region: "us-east-1",
  stackName: `${namePrefix}-ASG`,

  kerPairName: `${namePrefix}-Key-Pair`,
  kerPairNameDescription: `${namePrefix}-Key-Pair`,

  appName: `${namePrefix}-APP`,
  appAmi: `ami-0885b1f6bd170450c`

}

//------------------------------------------------------------------------------------------------------------
// *** APPLICATION LOAD BALANCER STACK ***
//------------------------------------------------------------------------------------------------------------
export const albStackConf = {
  region: "us-east-1",
  stackName: `${namePrefix}-ALB`,

  loadBalancerName: `${namePrefix}-ALB`,
  listenerHttpName: `${namePrefix}-ALB AppLbHttpListener`,
  listenerHttpTargetsName: `${namePrefix}-ALB-ASG-app`
}

//------------------------------------------------------------------------------------------------------------
// *** S3 BUCKET STACK ***
//------------------------------------------------------------------------------------------------------------
export const s3StackConf = {
  region: "us-east-1",
  stackName: `${namePrefix}-S3`,

  bucketName: `growprj-s3-web-bk-unique`
}