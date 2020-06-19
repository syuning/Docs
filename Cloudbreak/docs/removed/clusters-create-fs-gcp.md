#### FileSystem 

[comment]: <> (This is for Google Storage FileSystem options which were taken out from 2.1 TP)

7. On the **File System** page, select to use one of the following filesystems:

    * *Local HDFS*: No external storage outside of HDFS will be used
    * *GCS file system*: If you select to use Google Cloud Storage option, you must provide:

        | Parameter | Description |
|---|---|  
| Project Id | The project ID registered when creating a credential should be pre-populated. |
| Service Account Email Address | The email address registered when creating a credential should be pre-populated. |
| Default Bucket Name | (Deprecated) The name of an existing Google Cloud Storage bucket. This is an optional and deprecated configuration parameter (mapped to "fs.gs.system.bucket" in core-site.xml) to set the GCS bucket as a default bucket for URIs without having to specify the "gs:" prefix.  For more information about the [GCS file system](https://cloud.google.com/storage/docs/gcs-fuse) and [bucket naming](https://cloud.google.com/storage/docs/naming#requirements), refer to  GCP documentation. |
