## Troubleshooting Cloudbreak

This section includes common errors and steps to resolve them. 


### Invalid PUBLIC_IP in CBD Profile

The `PUBLIC_IP` property must be set in the cbd Profile file or else you won’t be able to log in on the Cloudbreak UI. 

If you are migrating your instance, make sure that after the start the IP remains valid. If you need to edit the `PUBLIC_IP` property in Profile, make sure to restart Cloudbreak using `cbd restart`.


### Cbd cannot get VM's public IP 

By default the `cbd` tool tries to get the VM's public IP to bind Cloudbreak UI to it. But if `cbd` cannot get the IP address during the initialization, you must set it manually. Check your `Profile` and if `PUBLIC_IP` is not set, add the `PUBLIC_IP` variable and set it to the public IP of the VM. For example: 

<pre>export PUBLIC_IP=192.134.23.10</pre>


### Permission or connection problems 

[comment]: <> (Not sure what this refers to. It came from the Install on Your Own VM docs.)

If you face permission or connection issues, disable SELinux:

1. Disable SELINUX:

    <pre>setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config</pre>
 
3. Ensure the SELinux is not turned on afterwards:

    <pre>sestatus | grep -i mode
Current mode:                   permissive
Mode from config file:          permissive</pre>
 

### Creating cbreak_sultans_1 ... Error

`cbd start` returns the following error:

<pre>Creating cbreak_sultans_1 ... error

ERROR: for cbreak_sultans_1  Cannot create container for service sultans: unknown log opt 'max-size' for journald log driver
Creating cbreak_consul_1
Creating cbreak_logrotate_1 ... error
Creating cbreak_periscope_1 ... error
Creating cbreak_mail_1 ... error
Creating cbreak_haveged_1 ... error

ERROR: for cbreak_mail_1  Cannot create container for service mail: unknown log opt 'max-size' for journald log driver

Creating cbreak_uluwatu_1 ... error

Creating cbreak_smartsense_1 ... error

Creating cbreak_consul_1 ... error
Creating cbreak_identity_1 ... error

ERROR: for cbreak_identity_1  Cannot create container for service identity: unknown log opt 'max-file' for journald log driver
Creating cbreak_logsink_1 ... error
Creating cbreak_commondb_1 ... error

ERROR: for cbreak_commondb_1  Cannot create container for service commondb: unknown log opt 'max-size' for journald log driver

ERROR: for haveged  Cannot create container for service haveged: unknown log opt 'max-size' for journald log driver

ERROR: for uluwatu  Cannot create container for service uluwatu: unknown log opt 'max-size' for journald log driver

ERROR: for consul  Cannot create container for service consul: unknown log opt 'max-size' for journald log driver

ERROR: for commondb  Cannot create container for service commondb: unknown log opt 'max-size' for journald log driver

ERROR: for logrotate  Cannot create container for service logrotate: unknown log opt 'max-size' for journald log driver

ERROR: for periscope  Cannot create container for service periscope: unknown log opt 'max-size' for journald log driver

ERROR: for sultans  Cannot create container for service sultans: unknown log opt 'max-size' for journald log driver

ERROR: for mail  Cannot create container for service mail: unknown log opt 'max-size' for journald log driver

ERROR: for logsink  Cannot create container for service logsink: unknown log opt 'max-size' for journald log driver

ERROR: for smartsense  Cannot create container for service smartsense: unknown log opt 'max-size' for journald log driver

ERROR: for identity  Cannot create container for service identity: unknown log opt 'max-file' for journald log driver
Encountered errors while bringing up the project.</pre>

This means that your [Docker logging drivers](https://docs.docker.com/config/containers/logging/configure/) are not configured correctly.

To resolve the issue, on your Cloudbreak VM:

1. Check the Docker Logging Driver configuration:

    <pre>docker info | grep "Logging Driver"</pre>
    
    If it is set to "Logging Driver: journald", you must set it to "json-file". 
    
2. Open the `docker` file for editing:

    <pre>vi /etc/sysconfig/docker</pre>
    
2. Edit the following part of the file so that it looks like below (showing `log-driver=json-file`):

    <pre># Modify these options if you want to change the way the docker daemon runs
OPTIONS='--selinux-enabled --log-driver=json-file --signature-verification=false'</pre>     

3. Restart Docker:

    <pre>systemctl restart docker
systemctl status docker</pre>
        

[Comment]: <> (More: https://drive.google.com/drive/u/0/folders/1Ml8hU3pgphYt47LLWHilRpGQEo6sNee3) 
