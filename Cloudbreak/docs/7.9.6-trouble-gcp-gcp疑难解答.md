
## Troubleshooting Cloudbreak on GCP

### Google Cloud create cluster fails with permissions related error

In order to launch clusters on GCP via Cloudbreak, you must have a Service Account that Cloudbreak can use to create resources. In addition, you must also have a P12 key associated with that account.

Usually, a user with an "Owner" role can assign roles to new and existing service accounts from **IAM & Admin > IAM** in the Google Cloud console. If you are using your own account, you should be able to perform this step, but if you are using a corporate account, you will likely have to contact your Google Cloud admin.

The roles for the service account are described in [Service account](gcp-launch.md#service-account). 

