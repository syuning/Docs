## Troubleshooting cluster creation

### Configure communication via private IPs on AWS

Cloudbreak uses public IP addresses when communicating with cluster nodes. On AWS, you can configure it to use private IPs instead of public IPs by setting the CB_AWS_VPC variable in the Profile. 

> This configuration is available for AWS only. Do not use it for other cloud providers. 

1. Navigate to the Cloudbreak deployment directory and edit Profile. For example:

    <pre>cd /var/lib/cloudbreak-deployment/
vi Profile</pre>

2. Add the following entry, setting it to the AWS VPC identifier where you have deployed Cloudbreak:

    <pre>export CB_AWS_VPC=your-VPC-ID</pre>

    For example:
    
    <pre>export CB_AWS_VPC=vpc-e261a185</pre>
    
3. Restart Cloudbreak by using `cbd restart`.      

 
### Cannot access Oozie web UI

Ext JS is GPL licensed software and is no longer included in builds of HDP 2.6. Because of this, the Oozie WAR file is not built to include the Ext JS-based user interface unless Ext JS is manually installed on the Oozie server. If you add Oozie using Ambari 2.6.1.0 to an HDP 2.6.4 or greater stack, no Oozie UI will be available by default. Therefore, if you plan to use Oozie web UI with Ambari 2.6.1.0 and HDP 2.6.4 or greater, you you must manually install Ext JS on the Oozie server host.

You can install Ext JS by adding the following PRE-AMBARI-START recipe:

<pre>export EXT_JS_VERSION=2.2-1
     export OS_NAME=centos6
     wget http://public-repo-1.hortonworks.com/HDP-UTILS-GPL-1.1.0.22/repos/$OS_NAME/extjs/extjs-$EXT_JS_VERSION.noarch.rpm
     rpm -ivh extjs-$EXT_JS_VERSION.noarch.rpm</pre> 
     
Make the following changes to the script:

* Change the EXT_JS_VERSION to the specific ExtJS version that you want to use.  
* Change the OS_NAME to the name of the operating system. Supported values are: centos6, centos7, centos7-ppc.

The general steps are:

1. Be sure to review and agree to the Ext JS license prior to using this recipe.  
2. Create a PRE-AMBARI-START recipe. For instructions on how to create a recipe, refer to [Add recipes](#add-recipes).   
3. When creating a cluster, choose this recipe to be executed on all host groups of the cluster. 

**Related links**  
[Add recipes](recipes.md#add-recipes)  
[Using custom scripts (recipes)](recipes.md)  


### Quota limitations

Each cloud provider has quota limitations on various cloud resources, and these quotas can usually be increased on request. If there is an error message in Cloudbreak stating that there are no more available EIPs (Elastic IP Address) or VPCs, you need to request more of these resources. 

To see the limitations visit the cloud provider’s site:

* [AWS service limits](http://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html) 
* [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits)
* [GCP resource quotas](https://cloud.google.com/compute/quotas) 

### Connection timeout when ports are not open

In the cluster installation wizard, you must specify on which node you want to run the Ambari server. Cloudbreak communicates with this node to orchestrate the installation.

A common reason for connection timeout is security group misconfiguration. Cloudbreak allows configuring different security groups for the different instance groups; however, there are certain requirements for the Ambari server node. Specifically, the following ports must be open in order to communicate with that node:

* 22 (SSH)  
* 9443 (two-way-ssl through nginx) 


### Blueprint errors 

#### Invalid services and configurations

Ambari blueprints are a declarative definition of a cluster. With a blueprint, you specify a stack, the component layout, and the configurations to materialize a Hadoop cluster instance via a REST API without having to use the Ambari cluster install wizard. 

Cloudbreak supports any type of blueprints, which is a common source of errors. These errors are only visible once the core infrastructure is up and running and Cloudbreak tries to initiate the cluster installation through Ambari. Ambari validates the blueprint and  rejects it if it's invalid. 

For example, if there are configurations for a certain service like Hive but Hive as a service is not mapped to any host group, the blueprint is invalid.

To fix these type of issues, edit your blueprint and then reinstall your cluster. Cloudbreak UI has support for this so the infrastructure does not have to be terminated.

There are some cases when Ambari cannot validate your blueprint beforehand. In these cases, the issues are only visible in the Ambari server logs. To troubleshoot, check Ambari server logs.


#### Wrong HDP/HDF version

In the blueprint, only the major and minor HDP/HDF version should be defined (for example, "2.6"). If wrong version number is provided, the following error can be found in the logs:

```
5/15/2017 12:23:19 PM testcluster26 - create failed: Cannot use the specified Ambari stack: HDPRepo
{stack='null'; utils='null'}
. Error: org.apache.ambari.server.controller.spi.NoSuchResourceException: The specified resource doesn't exist: Stack data, Stack HDP 2.6.0.3 is not found in Ambari metainfo
```

For correct blueprint layout, refer to the [Ambari cwiki](https://cwiki.apache.org/confluence/display/AMBARI/Blueprints) page.
  

### Recipe errors 

#### Recipe execution times out

If the scripts are taking too much time to execute, the processes will time out, as the threshold for all recipes is set to 15 minutes. To change this threshold, you must override the default value by adding the following to the cbd Profile file:


```
export CB_JAVA_OPTS=” -Dcb.max.salt.recipe.execution.retry=90”
``` 

This property indicates the number of tries for checking if the scripts have finished with a sleep time (i.e. the wait time between two polling attempts) of 10 seconds. The default value is 90. To increase the threshold, provide a number greater than 90. You must restart Cloudbreak after changing properties in the Profile file.


#### Recipe execution fails

It often happens that a script cannot be executed successfully because there are typos or errors in the script. To verify this you can check the recipe logs at
`/var/log/recipes`. For each script, there will be a separate log file with the name of the script that you provided on the Cloudbreak UI.
