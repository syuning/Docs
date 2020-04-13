Removed from Troubleshooting 


#### Changing Amari Credentials

[comment]: <> (I don't see this option in the 2.1 TP UI, just in the CLI.)

In Cloudbreak 1.14 and later, Cloudbreak creates a new admin user in Ambari, so you can change the credentials of the admin user in the Ambari web UI. You can also set the admin user credentials in the cluster installation wizard in the Cloudbreak UI.

In Cloudbreak versions earlier than 1.14 it is not possible to change the password in the Ambari UI. If you change the admin credentials in the Ambari UI, Cloudbreak will no longer be able to orchestrate Ambari. To change the password, you must use the option available on the cluster details page in the Cloudbreak UI. 