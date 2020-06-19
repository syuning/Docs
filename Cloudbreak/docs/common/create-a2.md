| Platform Version | Choose the HDP or HDF version to use for this cluster. Blueprints available for this platform version will be populated under "Cluster Type" below. If you selected the **HDF** platform, refer to [Creating HDF clusters](hdf.md) for HDF cluster configuration tips. |
| Cluster Type | Choose one of the default cluster configurations, or, if you have defined your own cluster configuration via Ambari blueprint, you can choose it here. For more information on default and custom blueprints, refer to [Using custom blueprints](blueprints.md). |
| Flex Subscription | This option will appear if you have configured your deployment for a [flex support subscription](get-help.md#flex-subscription). |

4. On the **Hardware and Storage** page, for each host group provide the following information to define your cluster nodes and attached storage. 

    To edit this section, click on the <img src="../images/cb_edit.png"/>. When done editing, click on the <img src="../images/cb_save.png" width="25"/> to save the changes.
    
    | Parameter | Description |
|---|---|
| Ambari Server | You must select one node for Ambari Server by clicking the <img src="../images/cb_toggle.png" alt="On"/> button. The "Instance Count" for that host group must be set to "1". If you are using one of the default blueprints, this is set by default. | 