## Access Data on Azure 

[comment]: <> (Removed the following from docs since this option is not available in the first version.)


#### Configuring Access to ADLS 

ADLS is not supported as a default file system, but access to data in ADLS via the adl connector is configured if you select ADLS during [cluster creation](azure-create.md), on the **Add File System** page. This option automates the configuration of the cluster with ADLS with the exception of the last step. 

After the [cluster is deployed](azure-create.md), you must perform the following steps manually to define which parts of the ADLS store this cluster will have access by adding the client credentials for the cluster to the data access control for the ADLS account. 

This last configuration option should not be automated, since you need to select which files in ADLS the cluster should access. For more information, review the [documentation](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-secure-data#filepermissions) on the Microsoft Azure Portal.  

**Steps**

1. In the Cloudbreak UI, navigate to the **Manage Credentials** section, select the credential used to deploy your cluster, and copy the "App Id” associated with it.   
2. Navigate to the Azure Portal > **Data Lake Store** and select your account.
3. Select the **Data Explorer** tab at the top and select the folder that you want the cluster to access. Select the root folder for full access. 
4. Select the **Access** tab at the top and then click **Add**.
5. Click **+Add** and paste the App Id (copied in step 1) in the search box to find client certificate name for the cluster.  (Alternatively, you can look up the App Name in the **Azure Active Directory** > **App Registrations**).
6. Choose the appropriate permissions. Note that if you do select the root folder, you need to provide “execute” access to all parent directories. For more information, refer to the [Azure documentation](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-secure-data#filepermissions). 
7. Test access to ADLS. Review the next sections for information on how to access data in ADLS from the cluster once it is deployed, for example from the command line of the cluster name node.

