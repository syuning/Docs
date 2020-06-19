
### VM requirements

To launch the Cloudbreak deployer and install the Cloudbreak application, you must have an existing VM. 

#### System requirements  

Your system must meet the following requirements:

* Minimum VM requirements: 16GB RAM, 40GB disk, 4 cores
* Supported operating systems: RHEL, CentOS, and Oracle Linux 7 (64-bit)

> You can install Cloudbreak on Mac OS X for evaluation purposes only. Mac OS X is not supported for a production deployment of Cloudbreak.


#### Root access

Every command must be executed as root. In order to get root privileges execute:

<pre>sudo -i</pre>


#### System updates

Ensure that your system is up-to-date by executing:

<pre>yum -y update</pre>

Reboot it if necessary.

#### Install iptables

Perform these steps to install and configure iptables.

**Steps** 

1. Install iptables-services:

    <pre>yum -y install net-tools ntp wget lsof unzip tar iptables-services
systemctl enable ntpd && systemctl start ntpd
systemctl disable firewalld && systemctl stop firewalld</pre>

    > Without iptables-services installed the `iptables save` command will not be available.

2. Configure permissive iptables on your machine:

    <pre>iptables --flush INPUT && \
iptables --flush FORWARD && \
service iptables save</pre>


#### Disable SELINUX

Perform these steps to disable SELINUX.

**Steps** 

1. Disable SELINUX:
    
    <pre>setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' 
/etc/selinux/config</pre>

2. Run the following command to ensure that SELinux is not turned on afterwards: 

    <pre>getenforce</pre>
    
3. The command should return "Disabled".     

    
#### Install Docker 

Perform these steps to install Docker. The minimum Docker version is 1.13.1. If you are using an older image that comes with an older Docker version, upgrade Docker to 1.13.1 or newer. 

**Steps**    

1. Install Docker service:

    <pre>yum install -y docker
systemctl start docker
systemctl enable docker</pre>

3. Check the Docker Logging Driver configuration:

    <pre>docker info | grep "Logging Driver"</pre>
    
4. If it is set to `Logging Driver: journald`, you must  set it to "json-file" instead. To do that:

    1. Open the `docker` file for editing:
    
        <pre>vi /etc/sysconfig/docker</pre>  
        
    2. Edit the following part of the file so that it looks like below (showing `log-driver=json-file`):

        <pre># Modify these options if you want to change the way the docker daemon runs
OPTIONS='--selinux-enabled --log-driver=json-file --signature-verification=false'</pre>     

    3. Restart Docker:

        <pre>systemctl restart docker
systemctl status docker</pre>

