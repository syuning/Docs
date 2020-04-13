## Troubleshooting Cloudbreak on Azure 

### Cloudbreak deployment errors 

#### Invalid resource reference

Example error message:  
*<span class="cfn-output3">Resource /subscriptions/.../resourceGroups//providers/Microsoft.Network/virtualNetworks/cbdeployerVnet/  
subnets/cbdeployerSubnet referenced by resource /subscriptions/.../resourceGroups/Manulife-ADLS/providers/  
Microsoft.Network/networkInterfaces/cbdeployerNic was not found.  
Please make sure that the referenced resource exists, and that both resources are in the same region.</span>*

**Symptom**: The most common reason for this error is that you did not provide the Vnet RG Name (last parameter in the template).  

**Solution**: When launching Cloudbreak, under "Vnet RG Name" provide the name of the resource group in which the selected VNet is located. If using a new VNet, enter the same resource group name as in "Resource group". 

### Credential prerequisite errors

#### You don't have enough permissions to assign roles 

This error during the interactive credential creation typically means that you do not have suitable permissions to create an interactive credential. Using an interactive credential currently requires an "Owner" role or its equivalent so if you are using a corporate account you are unlikely to have it. Try using the app-based credential. 

#### Problems with IAM permissions assignment 

After registering an Azure application you may have to ask your Azure administrator to perform the step of assigning the "Contributor" role to it:

<a href="../images/cb_azure-appbased03.png" target="_blank" title="click to enlarge"><img src="../images/cb_azure-appbased03.png" width="650" title="Azure Portal"></a> 


### Credential creation errors

#### Role already exists

Example error message: *<span class="cfn-output3">Role already exists in Azure with the name: CloudbreakCustom50</span>*

**Symptom**: You specified that you want to create a new role for Cloudbreak credential, but an existing role with the same name already exists in Azure. 

**Solution**: You should either rename the role during credential creation or select the `Reuse existing custom role` option. 

#### Role does not exist

Example error message: *<span class="cfn-output3">Role does not exist in Azure with the name: CloudbreakCustom60</span>*

**Symptom**: You specified that you want to reuse an existing role for your Cloudbreak credential, but that particular role does not exist in Azure.

**Solution**: You should either rename the new role during the credential creation to match the existing role's name or select the `Let Cloudbreak create a custom role` option. 

#### Role does not have enough privileges 

Example error message: *<span class="cfn-output3">CloudbreakCustom 50 role does not have enough privileges to be used by Cloudbreak!</span>  
<span class="cfn-output3"></span>*

**Symptom**: You specified that you want to reuse an  existing role for your Cloudbreak credential, but that particular role does not have the necessary privileges for Cloudbreak cluster management.

**Solution**: You should either select an existing role with enough privileges or select the `Let Cloudbreak create a custom role` option.
 
The necessary action set for Cloudbreak to be able to manage the clusters includes:
        `"Microsoft.Compute/*",
        "Microsoft.Network/*",
        "Microsoft.Storage/*",
        "Microsoft.Resources/*"`
 
#### Client does not have authorization  

Example error message:  
*<span class="cfn-output3">Failed to verify credential: Status code 403, {"error":{"code":"AuthorizationFailed",  
"message":"The client 'X' with object id 'z' does not have authorization to perform action  
'Microsoft.Storage/storageAccounts/read' over scope 'subscriptions/...'"}</span>*

**Symptom**: Your Azure account does not have sufficient permissions to create a Coudbreak credential. 

**Solution**: If you get this error during interactive credential creation, please ensure that your Azure account has `Microsoft.Authorization/*/Write` permission. Otherwise contact your Azure administrator to either give your account that permission or create the necessary resources for the app-based credential creation method.  
 
#### Cloud not validate publickey certificate

Example error message:  
*<span class="cfn-output3">Could not validate publickey certificate [certificate: 'fdfdsf'], detailed message:   
Corrupt or unknown public key file format</span>*

**Symptom**: The syntax of your SSH public key is incorrect.

**Solution**: You must correct the syntax of your SSH key. For information about the correct syntax, refer to [this](https://tools.ietf.org/html/rfc4716#section-3.6) page.
