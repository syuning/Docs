
## Getting help

If you need help with Cloudbreak, you have two options:

| Option | Description |
|---|---|
| [Hortonworks Community Connection](#hcc) |	This is free optional support via Hortonworks Community Connection (HCC).|
| [Hortonworks Flex Support Subscription](#flex-subscription) | This is paid Hortonworks enterprise support.|


### HCC

You can register for optional free community support at [Hortonworks Community Connection](https://community.hortonworks.com/answers/index.html) where you can browse articles and previously answered questions, and ask questions of your own. When posting questions related to Cloudbreak, make sure to use the "Cloudbreak" tag.


### Flex subscription

You can optionally use your existing Hortonworks [flex support subscription(s)](https://hortonworks.com/services/support/enterprise/) to cover the Cloudbreak node and clusters managed by it. 

> You must have an existing SmartSense ID and a Flex subscription. For general information about the Hortonworks Flex Support Subscription, visit the Hortonworks Support page at [https://hortonworks.com/services/support/enterprise/](https://hortonworks.com/services/support/enterprise/).

The general steps are:

1. Configure Smart Sense in your `Profile` file.   
2. Register your Flex subscription in the Cloudbreak web UI. You can register and manage multiple Flex subscriptions. For example, you can choose to use your Flex subscription to cover the Cloudbreak node.   
3. When creating a cluster, in the **General Configuration** > **Flex Subscription**, you can select the Flex subscription that you want to use for the cluster.  


#### Configuring SmartSense

To configure SmartSense in Cloudbreak, enable SmartSense and add your SmartSense ID to the `Profile` by adding the following variables:

<pre>export CB_SMARTSENSE_CONFIGURE=true
export CB_SMARTSENSE_ID=YOUR-SMARTSENSE-ID</pre>
    
For example:
 
<pre>export CB_SMARTSENSE_CONFIGURE=true
export CB_SMARTSENSE_ID=A-00000000-C-00000000</pre>

You can do this in one of the two ways:

* When initiating Cloudbreak deployer  
* After you've already initiated Cloudbreak deployer. If you choose this option, you must restart Cloudbreak using `cbd restart`.


#### Register and manage flex subscriptions

Once you log in to the Cloudbreak web UI, you can manage your Flex subscriptions from the **Settings** page > **Flex Subscriptions**:

<a href="../images/cb_cb-flex-settings.png" target="_blank" title="click to enlarge"><img src="../images/cb_cb-flex-settings.png" width="650" title="Autoscaling in Cloudbreak UI"></a>  

You can:
 
* Register a new Flex subscription    
* Set a default Flex subscription ("Default")  
* Select a Flex subscription to be used for the Cloudbreak node ("Use for controller")  
* Delete a Flex subscription    

[comment]: <> (This is not implemented yet: Check which clusters are connected to a specific subscription.)  



#### Use flex subscription for a cluster 

When creating a cluster, on the **General Configuration** page you can select the Flex subscription that you want to use for the cluster:

<a href="../images/cb_cb-flex-cluster.png" target="_blank" title="click to enlarge"><img src="../images/cb_cb-flex-cluster.png" width="650" title="Autoscaling in Cloudbreak UI"></a>  


#### Use flex subscription for Cloudbreak node

To use a Flex subscription for Cloudbreak node, on the **Settings** page, in the **Flex Subscriptions** section, check the "Use for controller option" for the selected Flex ID.  


### More Cloudbreak resources 

Check out the following documentation to learn more:

<table>
<tr><th width="25%"> Resource </th><th width="75%">Description</th><tr>
<tr><td><a href="http://docs.hortonworks.com/index.html" target="_blank">Hortonworks documentation </a></td>
<td><p>During cluster create process, Cloudbreak automatically installs Ambari and sets up a cluster for you. After this deployment is complete, refer to the <a href="http://docs.hortonworks.com/HDPDocuments/Ambari/Ambari-2.4.1.0/index.html" target="_blank">Ambari documentation</a> and <a href="http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.5.0/index.html" target="_blank">HDP documentation</a> for help.</p></td>
</tr>
<tr><td>
<a href="http://hortonworks.com/tutorials/" target="_blank">Hortonworks tutorials</a>
</td>
<td>Use Hortonworks tutorials to get started with Apache Spark, Apache Hive, Apache Zeppelin, and more.</td></tr>
<tr><td><a href="https://www.apache.org/" target="_blank">Apache documentation</a></td>
<td>
<p> In addition to Hortonworks documentation, refer to the Apache Software Foundation documentation to get information on specific Hadoop services. 
</p>
</td></tr>
<tr><td><a href="https://cwiki.apache.org/confluence/display/AMBARI/Blueprints" target="_blank">Ambari blueprints</a></td><td>Learn about Ambari blueprints. Ambari blueprints are a declarative definition of a Hadoop cluster that Ambari can use to create Hadoop clusters.</td></tr>
<tr><td><a href="http://hortonworks.com/open-source/cloudbreak/" target="_blank">Cloudbreak project</a></td><td>Visit the Hortonworks website to see Cloudbreak-related news and updates.</td></tr>
<tr><td><a href="http://hortonworks.com/hadoop/ambari/" target="_blank">Apache Ambari project</a></td><td>Learn about the Apache Ambari project. Apache Ambari is an operational platform for provisioning, managing, and monitoring Apache Hadoop clusters. Ambari exposes a robust set of REST APIs and a rich web interface for cluster management.</td></tr>
</table>




