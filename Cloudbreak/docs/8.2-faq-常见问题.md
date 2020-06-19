## FAQs

How to...

### Generate SSH key pair 

All the instances created by Cloudbreak are configured to allow key-based SSH, so you'll need to provide an SSH public key that can be used later to SSH onto the instances in the clusters you'll create with Cloudbreak. You can use one of your existing keys or you can generate a new one.

To generate a new SSH key pair, execute:

<pre>ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# Creates a new ssh key, using the provided email as a label
# Generating public/private rsa key pair.
# Enter file in which to save the key (/Users/you/.ssh/id_rsa): [Press enter]</pre>

You'll be asked to enter a passphrase, but you can leave it empty:

<pre># Enter passphrase (empty for no passphrase): [Type a passphrase]
# Enter same passphrase again: [Type passphrase again]</pre>

After you enter (or not) a passphrase, the key pair is generated. The output should look similar to:

<pre># Your identification has been saved in /Users/you/.ssh/id_rsa.
# Your public key has been saved in /Users/you/.ssh/id_rsa.pub.
# The key fingerprint is:
# 01:0f:f4:3b:ca:85:sd:17:sd:7d:sd:68:9d:sd:a2:sd your_email@example.com</pre>

Later you'll need to pass the content of the `.pub` file to Cloudbreak and use the private key file to SSH to the instances. 


### Recover public SSH key 

The `-y` option of `ssh-keygen` outputs the public key. For example:

<pre>ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub</pre>

### SSH to the hosts 

To connect to a running VM through SSH, you need to know its public IP address and have your private key available. 

The private key that you must use to access the VM is the counterpart of the public key that you specified when creating a Cloudbreak credential.

You can find the IP addresses of all the running VMs in the Cloudbreak UI, on the cluster details page. Only key-based authentication is supported. 

Cloudbreak creates a cloudbreak user which can be used to ssh into the box. This user has passwordless sudo rights.

For example:

```
ssh -i ~/.ssh/your-private-key.pem cloudbreak@<public-ip>
```

### Check Cloudbreak version 

To check Cloudbreak version, navigate to the Cloudbreak home directory and execute the following command:

```
cbd doctor
```


### Check available environment variables

To see all available environment variables with their default values, use:

```
cbd env show
```

### Access Cloudbreak logs

Refer to [Troubleshooting](trouble-cb-logs.md).




