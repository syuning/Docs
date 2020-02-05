### Create Cloudbreak credential

Before you can start creating clusters, you must first create a [Cloudbreak credential](concepts.md#cloudbreak-credential). Without this credential, you will not be able to create clusters via Cloudbreak. Cloudbreak works by connecting your Azure account through this credential, and then uses it to create resources on your behalf.

There are two methods for creating a Cloudbreak credential:


| Method | Description | Prerequisite | Steps |
|---|---|---|---|
| **Interactive** | The advantage of using this method is that the app and service principal creation and role assignment are fully automated, so the only input that you need to provide is the Subscription ID and Directory ID. During the interactive credential creation, you are required to log in to your Azure account. | (1) Your account must have the "Owner" role (or its equivalent) in the subscription. (2) You must be able log in to your Azure account. | To configure an interactive credential, refer to [Create an interactive credential](#create-an-interactive-credential). |
| **App-based** | The advantage of the app-based credential creation is that it allows you to create a credential without logging in to the Azure account, as long as you have been given all the information. In addition to providing your Subscription ID and  Directory ID, you must provide information for your previously created Azure AD application (its ID and key which allows access to it). | (1) Your account must have the "Contributor" role (or equivalent) in the subscription. (2) You or your Azure administrator must perform prerequisite steps of registering an Azure application and assigning the "Contributor" role to it. This step typically requires admin permissions so you may have to contact your Azure administrator. | To configure an app based credential, refer to [Create an app-based credential](#create-an-app-based-credential). |
