
## Ambari Database

[comment]: <> (Not sure if this is supported in 2.1 TP?)

By default, Ambari uses an embedded database to store data. Ambari and Cloudbreak don't perform backups of this database, so although this database is sufficient for ephemeral or test clusters, it is not sufficient for long-running production clusters. Therefore, you may need to configure a remote database for Ambari in Cloudbreak.

The overall steps are:  

1. Configure a remote database. You have two options for configuring a remote database: you can set up a supported database on your own or use a cloud provider database service.  
2. Next, you must pass the details to Cloudbreak during cluster creation, and Cloudbreak will configure Ambari to connect to that remote database. 

Cloudbreak supports out-of-the-box PostgreSQL, MariaDB, and MySQL. This means that if you are using any of these databases, you only need to create the database itself and configure user permissions to create the cluster. Cloudbreak will initialize database tables, relations, and default values, and will download JDBC driver for Ambari. For other databases, you have to execute create SQL on your database and deliver JDBC driver to `/opt/jdbc-drivers` directory on Ambari server node.

### Creating and Configuring a Remote Datatabase

Consider these constraints when setting up your remote database:   

- Cloudbreak doesn't validate the database connection, so wrong connection parameters will cause the cluster installation to fail.  
- Your database must be available to the Ambari server. This means that:  
    - The database must be located in the same region as the Ambari cluster. Slow database connection will cause cluster installation to fail.  
    - The database could be on a public server with firewall protection, but for security reasons we suggest that you use a private virtual network with subnet, and configure the Cloudbreak network to use existing resources.  
 - For the supported out-of-the-box databases, Cloudbreak creates the tables and upgrades Ambari if necessary, but performing any other operations on the database is your responsibility.  
- If you selected PostgreSQL, you must use the `public` schema. It is not possible to use a different schema for Ambari.  
- Database name, username, and password should not contain the `'` character. Other special characters are allowed.  


### Register the Database in Cloudbreak UI


[comment]: <> (These options are not available in 2.1 TP?)

You can configure Ambari database during cluster creation. The option is available in advanced options, in the **Configure Ambari Database** tab. You must provide the following information:

| Parameter | Description |
|---|---|
| Vendor | Select database vendor from the list. |
| Host | Enter database host IP. |
| Port | Enter port number. |
| Name | Enter database name. |
| User Name | Enter database user name. |
| Password | Enter database password. |



