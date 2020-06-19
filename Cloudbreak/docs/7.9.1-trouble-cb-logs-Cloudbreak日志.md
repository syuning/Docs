
## Checking Cloudbreak logs

[comment]: <> (TO-DO: How about 'cbd doctor'? I read in the Cloudbreak docs that "The doctor command helps you diagnose problems with your environment, such as common problems with your docker or boot2docker configuration. You can also use it to check cbd versions.") 

When troubleshooting, you can access the following Cloudbreak logs.

### Cloudbreak logs

When installing Cloudbreak using a pre-built cloud image, the  Cloudbreak deployer location and the cbd root folder is `/var/lib/cloudbreak-deployment`. You must execute all cbd actions from the cbd root folder as a cloudbreak user. 

> Your cbd root directory may be different if you installed Cloudbreak on your own VM. 


#### Aggregated logs

Cloudbreak consists of multiple microservices deployed into Docker containers. 

To check aggregated service logs, use the following commands:

`cbd logs` shows all service logs.

`cbd logs | tee cloudbreak.log` allows you to redirect the input into a file for sharing these logs.

#### Individual service logs

To check individual service logs, use the following commands:

`cbd logs cloudbreak` shows Cloudbreak logs. This service is the backend service that handles all deployments.

`cbd logs uluwatu` shows Cloudbreak UI logs. Uluwatu is the UI component of Cloudbreak.

`cbd logs identity` shows Identity logs. Identity is responsible for authentication and authorization.

`cbd logs periscope` shows Periscope logs. Periscope is responsible for triggering autoscaling rules.

#### Docker logs

The same logs can be accessed via Docker commands:

`docker logs cbreak_cloudbreak_1` shows the same logs as `cbd logs cloudbreak`.

Cloudbreak logs are rotated and can be accessed later from the Cloudbreak deployment folder. Each time you restart the application via cbd restart a new log file is created with a timestamp in the name (for example, cbreak-20170821-105900.log). 

> There is a symlink called `cbreak.log` which points to the latest log file. Sharing this symlink does not share the log itself.
 

### Saltstack logs

Cloudbreak uses Saltstack to install Ambari and the necessary packages for the HDP/HDF provisioning. Salt Master always runs alongside the Ambari Server node. Each instance in the cluster runs a Salt Minion, which connects to the Salt Master. There can be multiple Salt Masters if the cluster is configured to run in HA (High Availability) mode and in this case each Salt Minion connects to each Salt Master.

Cloudbreak also uses SaltStack to execute user-provided customization scripts called "recipes". 

Salt Master and Salt Minion logs can be found at the following location: `/var/log/salt`


### Ambari logs

Cloudbreak uses Ambari to orchestrate the installation of the different HDP/HDF components. Each instance in the cluster runs an Ambari agent which connects to the Ambari server. Ambari server is declared by the user during the cluster installation wizard. 

#### Ambari server logs

Ambari server logs can be found on the nodes where Ambari server is installed in the following locations:

`/var/log/ambari-server/ambari-server.log`

`/var/log/ambari-server/ambari-server.out`

Both files contain important information about the root cause of a certain issue so it is advised to check both.

#### Ambari agent logs

Ambari agent logs can be found on the nodes where Ambari agent is installed in the following locations:

`/var/log/ambari-agent/ambari-agent.log`

[comment]: <> (This doc http://hortonworks.github.io/cloudbreak-docs/release-1.16.4/operations/#ambari-server-node mentions more HDP/Ambari logs than these mentioned above. It says: "You can access Hadoop logs from the host and from the container in the /hadoopfs/fs1/logs directory." and "You can access Ambari logs from the host instance in the `/hadoopfs/fs1/logs folder." How are these logs different than these mentioned above?)


### Recipe logs

Cloudbreak supports "recipes" - user-provided customization scripts that can be run prior to or after cluster installation. It is the user’s responsibility to provide an idempotent well tested script. If the execution fails, the recipe logs can be found at `/var/log/recipes` on the nodes on which the recipes were executed.

It is advised, but not required to have an advanced logging mechanism in the script, as Cloudbreak always logs every script that are run. Recipes are often the sources of installation failures as users might try to remove necessary packages or reconfigure services.
   

