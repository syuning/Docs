#### FileSystem 

[comment]: <> (This is for Azure FileSystem options which were taken out from 2.1 TP)

5. On the **File System** page, select to use one of the following filesystems:

    * *Local HDFS*: No external storage outside of HDFS will be used.
    * *Windows Azure Data Lake Storage*: If you select this option, HDFS will be used as your default file system and access to ADLS will be through the adl connector. You must provide:

        | Parameter | Description |
|---|---|  
| Data Lake Store account name | Enter your account name. |
        
        **Postrequisites**: After cluster installation, you must perform additional steps described in [Configuring Access to ADLS](azure-data.md#configuring-access-to-adls). 
        
    * *Windows Azure Blob Storage*: If you select this option, HDFS will be used as your default file system and access to WASB will be through the wasb connector, unless you select **Use File System As Default**. You must provide:

        | Parameter | Description |
|---|---|  
| Storage Account Name | Enter your account name. |
| Storage Account Access Key | Enter your access key. |
| Use File System As Default | Select this option if you want to make WASB your default file system, instead of HDFS. |

    After selecting the filesystem, you can optionally configure the following advanced parameters:

    | Parameter | Description |
|---|---|
| Attached Storage Type | Select **single storage for all VMs** or **separate storage for every VM**. Selecting single storage means that your whole cluster's OS disks will be placed in one storage account. Using separate storage for every VM will deploy as many storage accounts as the number of nodes in your cluster, avoiding the IOPS limit of a particular storage account. |
| Persistent Storage Name | Enter a name for the persistent storage directory. Default is **cbstore**. |


