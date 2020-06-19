

[Comment]: <> (On AWS/GCP Existing security groups should be selectable only for existing VPC.)

    | Option | Description |
|---|---|
| New Security Group | <p>(Default) Creates a new security group with the rules that you defined:</p><p><ul><li>A set of [default rules](security.md#default-cluster-security-groups) is provided. You should review and adjust these default rules. If you do not make any modifications, default rules will be applied. </li><li>You may open ports by defining the CIDR, entering port range, selecting protocol and clicking **+**.</li><li>You may delete default or previously added rules using the delete icon.</li><li>If you don't want to use security group, remove the default rules.</li><ul></p> |  
| Existing Security Groups | Allows you to select an existing security group that is already available in the selected provider region. This selection is disabled if no existing security groups are available in your chosen region. |  

    The default experience of creating network resources such as network, subnet and security group automatically is provided for convenience. We strongly recommend you review these options and for production cluster deployments leverage your existing network resources that you have defined and validated to meet your enterprise requirements. For more information, refer to <a href="../security-cb-inbound/index.html">Restricting inbound access from Cloudbreak to cluster</a>. 



5. On the **Security** page, provide the following parameters:

    | Parameter | Description |
|---|---|
| Cluster User | You can log in to the Ambari UI using this username. By default, this is set to `admin`. |
| Password | You can log in to the Ambari UI using this password. |
| Confirm Password | Confirm the password. |
| New SSH public key | Check this option to specify a new public key and then enter the public key. You will use the matching private key to access your cluster nodes via SSH. |
| Existing SSH public key | Select an existing public key. You will use the matching private key to access your cluster nodes via SSH. This is a default option as long as an existing SSH public key is available.  |