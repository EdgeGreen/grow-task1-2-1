# Mentoring Program. AWS-CDK.
------------------------------------------------------------------------------------------
![](Images/Grow.PNG)
------------------------------------------------------------------------------------------
### Task:
Create an application stack:
Networking – 1 VPC in us-east-1, 4 subnets (2 private and 2 public in different AZs), Internet GW
Application – EC2 instance (AMI: ubuntu20.04, preconfigure Apache web server with a simple web-site), S3 bucket which should be accessible only from EC2 instance with a web server, not from the world, Security Group for an instance (SSH enabled from your home’s network, HTTP and HTTPS enabled from the world), application load balancer attached to the instance. EC2 instance should in a public subnet.

You should have a cron job on the instance which should copy a web site content to S3 bucket every day.

Please note, that for terraform configuration you should have a remote state with s3 bucket backend (separate from a bucket for web content backups). DynamoDB lock table for a remote state is optional.

For both CF and TF tasks please use separate files, do not put all code in one file. You should split your code in a correct way which will be useful and comfortable.

------------------------------------------------------------------------------------------
### Some Screenshots
------------------------------------------------------------------------------------------
![](Images/1.PNG)
------------------------------------------------------------------------------------------
![](Images/2.PNG)
------------------------------------------------------------------------------------------
![](Images/3.PNG)
------------------------------------------------------------------------------------------
![](Images/4.PNG)
------------------------------------------------------------------------------------------
![](Images/5.PNG)
------------------------------------------------------------------------------------------
