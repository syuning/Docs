# 基于kylin4的浪潮云HD部署

## 第一章 硬件信息
### 操作系统: 银河kylin4.0.2
### 芯片：ARM64

## 第二章 部署安装
### 2.1 安装流程
#### 2.1.1 准备环境
1. 安装源： http://10.221.129.22/kylin-arm64/

2. 资源列表：用户密码均为inspur/inspur123 (sudo -i 以使用管理员权限)
序号 | 服务器mgtip（外部访问） | data数据网ip（内部访问） | 主机名
--- | -------------------- |---------------------- |---------------
1	|	10.110.56.220     |		172.16.15.220      | manager.bigdata.com
2 	|	10.110.56.221 	  |		172.16.15.221      | master1.bigdata.com
3 	|	10.110.56.222	  |		172.16.15.222      | master2.bigdata.com
4 	|	10.110.56.223     |		172.16.15.223      | worker1.bigdata.com
5 	|	10.110.56.224 	  |		172.16.15.224      | worker2.bigdata.com
6 	|	10.110.56.225     |		172.16.15.225      | worker3.bigdata.com

##### 2.1.1.1 修改主机名
1.集群所有节点均需要执行修改主机名称的操作。

 (1) 通过Shell连接主机

	ssh -q -l root -p 22 10.110.56.220

 (2) 修改主机名，如:  

	sudo -i hostnamectl set-hostname manager.bigdata.com

	查看主机名:
	cat /etc/hostname

##### 2.1.1.2 修改ip与域名的对应关系:

集群所有节点均需执行此操作。

以manager和master1为例:
######  1. 运行命令:
	sudo -i vi cat
添加

172.16.15.220 manager.bigdata.com
172.16.15.221 master1.bigdata.com
172.16.15.222 master2.bigdata.com
172.16.15.223 worker1.bigdata.com
172.16.15.224 worker2.bigdata.com
172.16.15.225 worker3.bigdata.com

######  2. 查看修改是否成功:
	cat /etc/hosts
######  3.将修改好的配置文件分发到集群中其他节点: 
	scp /etc/hosts root@master1.bigdata.com:/etc
	scp /etc/hosts root@master2.bigdata.com:/etc
	scp /etc/hosts root@worker1.bigdata.com:/etc
	scp /etc/hosts root@worker2.bigdata.com:/etc
	scp /etc/hosts root@worker3.bigdata.com:/etc
	cat id_rsa.pub >> .ssh/authorized_keys
 	....
 	....
	 由于inspur用户无root权限，可以在各节点分别执行上面的命令手动修改host文件：
	 ssh -q -l inspur -p 22 172.16.15.221
	 sudo -i vi /etc/hosts
	 cat /etc/hosts

(运行sudo -i reboot重启)

##### 2.1.1.3 关闭seLinux
集群中所有节点均需执行此操作。
######  1. 暂时关闭:
 	setenforce 0
######  2. 永久关闭:
 	vi /etc/selinux/config
SELinux设置为:

	SELINUX=disabled
#### 2.1.1.4 关闭Linux透明大页
集群中所有节点均需执行此操作。
######  1. 暂时关闭:
	echo never > /sys/kernel/mm/transparent_hugepage/enabled
######  2. 开机关闭:
  	vi c
  加入代码:

if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
	echo never > /sys/kernel/mm/transparent_hugepage/enabled
fi
######  3. 查看透明大页是否已经关闭:
	cat /sys/kernel/mm/transparent_hugepage/enabled
显示如下内容说明透明大页已经关闭:
	always madvise [never]
#### 2.1.1.5 关闭防火墙
集群中所有节点均需执行此操作。

禁用防火墙:

	ufw disable
查看防火墙状态:

	ufw status
#### 2.1.1.6 打通SSH
server端要通过ssh协议将软件包分发到集群中各节点上，所以要打通server端到集群中各节点的ssh。
######  1. Shell登录Manager节点。
######  2. 打通ambari-server端到集群中所有节点的ssh:
	sudo -i ssh-keygen
	sudo -i ssh-copy-id root@manager.bigdata.com
	sudo -i ssh-copy-id root@master1.bigdata.com
	sudo -i ssh-copy-id root@master2.bigdata.com
	sudo -i ssh-copy-id root@worker1.bigdata.com
	sudo -i ssh-copy-id root@worker2.bigdata.com
	sudo -i ssh-copy-id root@worker3.bigdata.com

#### 2.1.2 源
##### 2.1.2.1 源文件修改
######  1.修改源列表文件
运行命令:

	vi /etc/apt/sources.list
加入:

deb http://10.221.129.22/kylin-arm64/Kylin-4.0.2/ juniper main
deb http://10.221.129.22/kylin-arm64/kylin4 juniper main
注释掉文件中的其他内容。
######  2. ambari安装源
写入/etc/apt/sources.list.d/ambari.list文件中:

	echo 'deb http://10.221.129.22/kylin-arm64/ambari/kylin4/2.7.3.0-0/ Ambari main' > /etc/apt/sources.list.d/ambari.list
##### 2.1.2.2 源更新
######  1. 运行命令:

	apt-get update
######  2. 安装源后所存放的目录:
	/var/cache/apt/archives

##### 2.1.2.3 添加密钥:
获取密钥文件:

	wget http://10.221.129.22/kylin-arm64/ambari/kylin4/2.7.3.0-0/gpg/Inspur_HD_Manager_Signing_Key_2019.pub
添加密钥文件:

	apt-key add Inspur_HD_Manager_Signing_Key_2019.pub

#### 2.1.3 ntp时间同步
集群中各节点从managerNode节点同步时间，managerNode节点从标准时钟服务器同步时间。
当managerNode节点出现故障时，各节点从masterNode节点同步时间。


![ntp](/pic/ntp.jpg)


##### 2.1.3.1 在集群中各节点上安装ntp服务。
	apt autoremove cifs-utils localechooser-data user-setup
	apt-get install -y ntp
	apt install -y ntpdate ntp ntp-doc ntpstat
来判断ntp是否安装成功:

	dpkg --get-selections ntp
##### 2.1.3.2 在集群各节点上修改ntp配置文件。
	vi /etc/ntp.conf
集群各类节点ntp.conf配置文件内容如下所示。

manager节点:

restrict -4 default kod notrap nomodify nopeer limited  #删除noquery
restrict -6 default kod notrap nomodify nopeer limited  #删除noquery

restrict 192.168.6.0 mask 255.255.255.0 nomodify notrap
server 192.168.0.1 prefer
server 127.127.1.0
fudge 127.127.1.0 stratum 8

[参数说明]:

192.168.6.0 和 255.255.255.0是集群所在网段的网关和子网掩码。

192.168.0.1是主时钟源的IP地址，请根据实际情况替换，prefer表示优先选择的时钟源。

master节点:

	restrict -4 default kod notrap nomodify nopeer limited  #删除noquery
	restrict -6 default kod notrap nomodify nopeer limited  #删除noquery

	restrict 192.168.6.0 mask 255.255.255.0 nomodify notrap
	server manager.bigdata.com prefer
	server 127.127.1.0
	fudge 127.127.1.0 stratum 9
worker节点和slave节点:

server manager.bigdata.com prefer
server master1.bigdata.com
server master2.bigdata.com
##### 2.1.3.3 使master、worker、slave节点从manager节点同步时间。
	service ntp stop
	ntpdate manager.bigdata.com
在启动ntp服务之前先手工同步下集群中各节点时间，ntp服务启动后，此命令将不能再执行。
##### 2.1.3.4 在各节点启动ntp服务。
	systemctl start ntp
##### 2.1.3.5 设置开机启动ntp服务。
	systemctl enable ntp
	/lib/systemd/systemd-sysv-install enable ntp
##### 2.1.3.6 查看ntp状态。
	ntpq -p

#### 2.1.4 jkd安装
openjdk安装:
##### 2.1.4.1 创建并切换到jdk64文件夹:
	mkdir /usr/jdk64
	cd /usr/jdk64
##### 2.1.4.2 获取openjdk包:
	wget http://10.221.129.22/kylin-arm64/openjdk1.8.0_aarch/openjdk-1.8.0-internal_aarch64.tar.gz
##### 2.1.4.3 解压openjdk包:
	tar -zxvf openjdk-1.8.0-internal_aarch64.tar.gz
将解压得到的openjdk-1.8.0-internal文件夹改名为jdk1.8.0_221方便后续配置:

	mv openjdk-1.8.0-internal jdk1.8.0_221
##### 2.1.4.4 配置环境变量
编辑环境变量配置文件:

	vi /etc/profile
添加内容:

export JAVA_HOME=/usr/jdk64/jdk1.8.0_221
CLASSPATH=.:$JAVA_HOME/lib:$JAVA_HOME/lib/mysql-connector-java.jar
export PATH=$PATH:$JAVA_HOME/bin
##### 2.1.4.5 运行命令:
	source /etc/profile

#### 2.1.5 安装JDBC驱动文件
##### 2.1.5.1 下载mysql-connector-java-5.1.47.jar
	cd /usr/jdk64/jdk1.8.0_221/lib
	wget http://10.221.129.22/kylin-arm64/Kylin-4.0.2/pool/main/m/mysql-5.7/mysql-connector-java-5.1.47.jar
##### 2.1.5.2 查看文件:
	ll
##### 2.1.5.3 创建软链接:
	ln -s mysql-connector-java-5.1.47.jar mysql-connector-java.jar

#### 2.1.6 python-dev安装
运行命令:

	wget http://10.221.129.22/kylin-arm64/kylin4/pool/main/p/python-dev/python-dev_2.7_all.deb
	dpkg -i python-dev_2.7_all.deb
	dpkg -i --force-overwrite python-dev_2.7_all.deb

#### 2.1.7 MySQL
##### 2.1.7.1 安装和初始化
版本：MySQL5.7
######  1. MySQL使用的是系统盘的源，所以直接运行安装命令:
	apt-get install mysql-server

######  2. 启动数据库:
	systemctl stop mysql.service
	systemctl start mysql.service
######  3. 查看是否启动成功:
	systemctl status mysql.service
######  4. 重置root密码:
mysql5.7安装时会提示设置root密码，默认密码为空。

将root用户密码修改为bigdata:

	mysql -uroot -p
	use mysql;
	update mysql.user set authentication_string=password('bigdata') where user='root';
######  5. 授权root用户在其他节点访问数据库的权限:
	GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'bigdata' WITH GRANT OPTION;
	FLUSH PRIVILEGES;
######  6. 重启数据库:
	systemctl restart mysql.service
######  7. 登录数据库，执行如下命令验证数据库编码是否为utf-8:
	 show variables like 'char%';
运行如下命令：

vi /etc/mysql/mysql.conf.d/mysqld.cnf
配置修改如下：
	skip-external-locking
	bind-address		= 0.0.0.0
如果需要修改为utf8，在lc-messages-dir = /usr/share/mysql语句后加入:

	 character-set-server = utf8

##### 2.1.7.2 MySQL主从配置
######  1.在数据库主节点创建同步用户sync。
     create user 'sync'@'%' identified by 'bigdata';
######  2.给sync用户赋予主从复制权限。
	grant replication slave on *.* to 'sync'@'%' identified by 'bigdata' with grant option;
######  3.在数据库从节点验证sync用户登录主节点mysql数据库。
登录数据库从节点所在的主机。

连接主节点mysql数据库。

    mysql -usync -pbigdata -hmanager.bigdata.com
######  4.配置主从、节点的my.cnf文件。
主节点/etc/my.cnf文件配置内容如下所示。

[mysqld]
datadir=/var/lib/mysql
#socket=/var/lib/mysql.sock
user=mysql
symbolic-links=0
log_bin_trust_function_creators=1
log-bin=mysql-bin
binlog-do-db=ambari
binlog-do-db=hue
binlog-do-db=hive
binlog-do-db=ranger
binlog-do-db=ranger_audit
binlog-do-db=oozie
binlog-ignore-db=mysql
binlog_format=mixed
server-id = 1
character-set-server=utf8
init_connect='SET NAMES utf8'
[client]
default-character-set=utf8
[mysql]
no-auto-rehash
default-character-set=utf8
[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/lib/mysql/manager.bigdata.pid
replicate-do-db=all

[mysqld]
wait_timeout=31536000
interactive_timeout=31536000


说明：需要做备份的数据库通过“binlog-do-db=ambari”参数进行配置。

从节点/etc/my.cnf文件配置内容如下所示。

[mysqld]
datadir=/var/lib/mysql
#socket=/var/lib/mysql.sock
user=mysql
symbolic-links=0
log_bin_trust_function_creators=1
log-bin=mysql-bin
replicate-do-db=ambari
replicate-do-db=hue
replicate-do-db=hive
replicate-do-db=ranger
replicate-do-db=ranger_audit
replicate-do-db=oozie
replicate-ignore-db=mysql
binlog_format=mixed
read_only=1
server-id = 2
default-storage-engine=InnoDB
character-set-server=utf8
init_connect='SET NAMES utf8'
[client]
default-character-set=utf8
[mysql]
no-auto-rehash
default-character-set=utf8
[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/lib/mysql/master1.bigdata.pid
######  5.分别登录主、从节点，重启MySQL服务。
	systemctl restart mysql
######  6.登录主节点的mysql数据库，对主节点上锁并查看状态。
	mysql -uroot -pbigdata
	flush tables with read lock;
	show master status;
######  7.登录从节点的mysql。
	mysql -uroot -pbigdata
######  8.在从节点关闭slave;
	stop slave;
######  9.在从节点配置从节点要同步的主节点信息。
	change master to master_host='172.16.15.220', master_user = 'sync', master_password = 'bigdata', master_log_file = 'mysql-bin.000001', master_log_pos = 6437;
参数解释说明如下：

master_user为同步用户。

master_log_file和master_log_pos为主节点执行完show master status后系统返回的参数。
######  10.在从节点启动mysql从节点。
	start slave;
######  11.在从节点验证mysql从节点的状态是否成功。
	show slave status;
返回结果中以下两项都为yes，说明配置成功。

	Slave_IO_Running: Yes
	Slave_SQL_Running: Yes
###### 12.主节点解锁。
	unlock tables;

#### 2.1.8 安装manager
##### 2.1.8.1 准备环境
创建ambari数据库及ambari用户并赋权。
######  1.通过shell登录集群的manager节点。
######  2.连接mysql数据库。
	mysql -uroot -p
######  3.创建ambari数据库。
	create database ambari;
######  4.创建ambari用户并赋权。
manager.bigdata.com根据实际情况改为对应的hostname

	grant all privileges on *.* to 'ambari'@'manager.bigdata.com' identified by 'bigdata' with grant option;
	FLUSH PRIVILEGES;

##### 2.1.8.2 安装ambari
运行命令:

	apt-get install ambari-server
##### 2.1.8.3 初始化ambari
###### 1.运行命令:
	ambari-server setup
配置过程中选项如下:

	Customize user ... daemon: n
	JDK: 2
	JAVA_HOME:/usr/jdk64/jdk1.8.0_221
	GPL: y
	database configuration: y
	3 (mysql选项)
	Hostname: 主机的hostname(如:kylin2.bigdata.com)
	Port: 3306
	Database name: ambari
	Username: ambari
	Password: bigdata
	jdbc: n
	输入: /usr/jdk64/jdk1.8.0_221/lib/mysql-connector-java.jar

若在配置时没有jdbc选项，需要继续运行如下命令配置jdbc:

	ambari-server setup --jdbc-db=mysql --jdbc-driver=/usr/jdk64/jdk1.8.0_221/lib/mysql-connector-java.jar
######  2. 执行sql脚本
登录数据库:

	mysql -uroot -pbigdata
运行命令:

	use ambari;
	source /var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql;
##### 2.1.8.4 启动ambari-server
######  1.启动ambari:
	ambari-server start
	/etc/ambari-server/conf/ambari.properties
######  2. 测试登录
打开浏览器，以kyin2(10.220.72.2)为例，输入 http://10.110.56.220:8080/ 登陆web页面成功表示manager安装成功。

#### 2.1.9 部署组件
##### 2.1.9.1 准备环境
######  1. 配置MySQL
提前配置好Hive、 Oozie 、Ranger、Dataspace所对应的数据库，并对相应用户授予权限。

root用户登录MySQL。

 (1) Hive组件:

	create database hive;
	use hive;
	grant all privileges on hive.* to 'hive'@'%' identified by 'bigdata';
	flush privileges;
 (2) Oozie组件:

	create database oozie;
	use mysql;
	grant all privileges on oozie.* to 'oozie'@'%' identified by 'bigdata';
	flush privileges;
 (3) Ranger组件:

	create database ranger;
	use mysql;
	grant all privileges on ranger.* to 'ranger'@'%' identified by 'bigdata';
	flush privileges;
 (4) Dataspace组件:

	create database dataspace;
	use mysql;
	grant all privileges on *.* to 'root'@'%' identified by 'bigdata';
	flush privileges;
######  2. 开启innodb表索引字符串最大长度限制（如若不执行此步骤，则ranger启动失败）。
	mysql -uroot -pbigdata
	use mysql;
	set global innodb_file_format = BARRACUDA;
	set global innodb_large_prefix = ON;
 [注意]：各组件依赖关系如下图所示，在安装部署过程中，有依赖关系的组件注意先部署被依赖的组件。


![](/pic/yilai.jpg)


建议各组件安装顺序如下：

Zookeeper --》hdfs --》HD Metrics --》yarn+mapreduce --》……… kerberos--》dataspace  
中间的省略号代表：其他组件安装顺序没有特殊说明（注意依赖关系即可）。
安装过程中出现的异常会有提示信息，请根据提示信息做相应操作。

可以在 /var/log/组件名/ 中查看安装日志，便于排查错误。

访问快速链接查看安装成功的WebUI，如果登录WebUI的主机没有配置IP和hostname的映射关系，在链接到组件WebUI界面时需要把域名更换成IP地址。

##### 2.1.9.2 安装源信息
	http://10.221.129.22/kylin-arm64/ambari/kylin4/2.7.3.0-0/
	http://10.221.129.22/kylin-arm64/hortonworks/HDP-GPL/kylin4/3.1.0.0-78/
	http://10.221.129.22/kylin-arm64/hortonworks/HDP-UTILS/kylin4/1.1.0.22/
	http://10.221.129.22/kylin-arm64/hortonworks/HDP/kylin4/3.1.0.0-78/
##### 2.1.9.3 常规组件部署（HDFS、ZooKeeper、HD Metrics、YARN + MapReduce2）
######  1. 登录Web页面
在浏览器中输入 http://10.200.72.2:8080/ 进入登录页面（ip地址修改为对应值）。

登录账密: admin admin

![](/pic/11.jpg)


######  2. 点击“启动安装向导”按钮，进行Insight HD部署。
######  3. 在“开始”向导页输入要创建的集群名称，点击“下一步”。

![](/pic/12.jpg)

######  4. 进入“选择版本”向导页，版本信息选择: HDP-3.1.0.0，并选择使用本地存储库。输入本地源地址，操作系统选择: kylin4 （其他操作系统版本移除）。单击“下一步”。
URL对应输入源地址:

	HDP: http://10.221.129.22/kylin-arm64/hortonworks/HDP/kylin4/3.1.0.0-78/
	HDP-GPL: http://10.221.129.22/kylin-arm64/hortonworks/HDP-GPL/kylin4/3.1.0.0-78/
	HDP-UTILS: http://10.221.129.22/kylin-arm64/hortonworks/HDP-UTILS/kylin4/1.1.0.22/

######  5. 在“安装选项”向导页中注册及确认主机。
(1)	在目标主机文本框中输入ambari-agent各节点hostname，如:manager.bigdata.com（每行输入一个节点的hostname即可）。

(2)	在主机注册信息中输入SSH私钥信息。

单击“选择文件”，选择路径“/root/.ssh/id_rsa”来配置私钥。

单击“注册和确认”。

![](/pic/14.jpg)

(安装完成后查看问题列表，最好解决掉所有警告)

######  6. 在“确认主机”向导页中，确认主机信息并安装ambari-agent相关进程。

![](/pic/15.jpg)

安装完成后，进度条会呈现绿色，状态栏信息会显示“Success”。

![](/pic/16.jpg)

点击提示信息“点击此处查看警告”，出现详细问题列表，建议将警告全部解决，便于此后集群的后续安装。

![](/pic/17.jpg)

######  7. 在“选择服务”向导页中选择需要安装的组件。
建议先同时安装HDFS、ZooKeeper、HD Metrics和YARN + MapReduce2，勾选完成后单击“下一步”，后续其他组件单独安装。

![](/pic/18.jpg)

[说明]：对于有依赖关系的组件，会有相关提示信息；同时，对未勾选的组件，集群安装完成后也可进行后续安装。
######  8. 在“指定Master”向导页中指定所选组件Master进程所在节点。
可完全采用默认设置。同时也可自定义进程要安装的节点。点击每个进程对应的下拉框，在下拉框显示的所有agent节点中进行选择。设置完成后点击“下一步”。

![](/pic/19.jpg)

[说明]：对于后面有绿色加号的组件，可以增加集群节点进行部署。
######  9. 在“指定Slaves和Client”向导页中指定所选组件Slaves或Client进程的所在节点。
可完全采用默认设置，也可进行自定义设置。“主机”一栏显示当前可用的agent节点，对每个agent节点，勾选要安装的服务（说明：NFSGateway不需要安装）设置完成后单击“下一步”。

![20](/pic/20.jpg)

[说明]：slave和client的可选组件在右边显示，请将水平滚动条拖动到最右端进行查看。
######  10. 在“自定义服务”向导页检查各个组件需要的配置是否完备。
对于需要用户手工配置或者配置存在问题的组件会在“CREDENTIALS”中创建。

![](/pic/21.jpg)

######  11. 进入“检查”向导页，检查配置信息，审查无误后，单击“部署”，进行组件安装。

![](/pic/22.jpg)


![](/pic/23.jpg)

######  12. 进入“安装、启动和测试”向导页，此过程中组件自动安装、启动和调试。

![](/pic/24.jpg)

安装完成后节点状态显示100%，消息提示“成功”。点击【下一步】查看概览。

![](/pic/25.jpg)

######  13. “概览”向导页提供了集群安装过程的概况，如果服务安装过程无异常，集群安装即成功。
######  14. 点击“完成”进入集群的控制台页面可监控集群。
同时，如果启动或测试过程出现问题，也会提示相关警告信息。

![](/pic/26.jpg)


##### 2.1.9.4 HBase部署
HMaster服务部署在Master节点上，RegionServer服务部署在Worker节点上，如果有其他服务则部署在manager节点上。
######  1.单击页面左侧“…”->“添加服务”，选择HBase并单击“下一步”。

![](/pic/31.jpg)

###### 2.根据安装向导提示信息，执行安装步骤。
###### 3.安装成功后，有Success标识。
###### 4.若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#####2.1.9.5 Hive部署 (Manager)
Hive部署在manager节点上，Hive依赖HDFS、Yarn+MapReduce、Tez。其中HDFS、Yarn+MapReduce的已安装，Tez组件在安装Hive时会提示自动安装。
###### 1.单击页面左侧“…”->“添加服务”，选择Hive并单击“下一步”。

![](/pic/31.jpg)


![](/pic/32.jpg)

###### 2.根据安装向导提示信息，执行安装步骤（请提前创建Hive数据库和用户及赋权）。
###### 3.在“自定义服务”向导页，根据提示信息，配置数据库相关信息。

![](/pic/33.jpg)


数据库选项选择 Exciting MySQL/MariaDB

输入数据库的账号密码（根据之前的设置，均为bigdata）

运行命令:

	ambari-server setup --jdbc-db=mysql --jdbc-driver=/usr/jdk64/jdk1.8.0_221/lib/mysql-connector-java.jar
点击TEST CONNECTION测试是否能连上数据库。
###### 4.安装成功后，有Success标识。

![](/pic/34.jpg)



![](/pic/35.jpg)

###### 5.安装完成后，执行如下语句对Hive数据库执行utf8编码:
	mysql -uhive -pbigdata
	use hive;
	alter table COLUMNS_V2 modify column COMMENT varchar(256) character set utf8;
	alter table TABLE_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8;
	alter table PARTITION_KEYS modify column PKEY_COMMENT varchar(4000) character set utf8;
	alter table TBLS modify column VIEW_ORIGINAL_TEXT mediumtext character set utf8;
	alter table TBLS modify column VIEW_EXPANDED_TEXT mediumtext character set utf8;
###### 6.若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

##### 2.1.9.6 Spark2部署 (Manager)
Spark部署时，根据安装规划，Spark相关服务部署在manager节点上。
###### 1.单击页面左侧“…”->“添加服务”，选择Spark并单击“下一步”。
###### 2.根据安装向导提示信息，执行安装步骤。
###### 3.安装成功后，有Success标识。
###### 4.若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

##### 2.1.9.7 Oozie部署 (Manager)
Oozie部署时，根据安装规划，Oozie相关服务部署在manager节点上。
###### 1.单击页面左侧“…”->“添加服务”，选择Oozie并单击“下一步”。
###### 2.根据安装向导提示信息，执行安装步骤（请提前创建Oozie数据库和用户及赋权）。
根据之前的设置，数据库账号密码: bigdata bigdata

点击TEST CONNECTION测试是否能连上数据库。
###### 3.安装成功后，有Success标识。
###### 4.若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

##### 2.1.9.8 Ranger部署(Manager)
Ranger部署时，根据安装规划，Ranger相关服务部署在manager节点上。
###### 1.单击页面左侧“…”->“添加服务”，选择Ranger并单击“下一步”。

![](/pic/41.jpg)

###### 2.根据安装向导提示信息，执行安装步骤（请提前创建Ranger数据库和用户及赋权）。

![](/pic/42.jpg)


以kylin2为例:

	DB Flavor: MYSQL
	Ranger DB host: kylin2.bigdata.com
	Ranger DB Password: bigdata
	DBA username: root
	DBA password: bigdata
###### 3.安装过程中，请将“Ranger Plugin”页签中，各组件的插件plugin打开。

![](/pic/43.jpg)

###### 4.安装过程中，请将“Ranger Audit”页签的“Audit to Solr”和“Audit to HDFS”选项关掉。

![](/pic/44.jpg)

###### 5.配置“ADVANCED”页签中“高级设置ranger-env”区域的内容。

![](/pic/45.jpg)

###### 6.安装成功后，有Success标识。
###### 7.若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

##### 2.1.9.9 Sqoop部署 (Manager)
Sqoop部署时，根据安装规划，Sqoop相关服务部署在manager节点上。
###### 1.单击页面左侧“…”->“添加服务”，选择Sqoop并单击“下一步”。
###### 2.根据安装向导提示信息，执行安装步骤。
###### 3.安装成功后，有Success标识。
###### 4.若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

##### 2.1.9.10 DataSpace部署 (Slave)
DataSpace服务作为数据空间资源管理服务，需要集群开启安全模式（kerberos）才能正常使用，开启安全模式操作具体请参考 “开启安全模式”章节，DataSpace Server要求安装在manager节点。
###### 1. 单击页面左侧“…”->“添加服务”，选择dataspace服务单击“下一步”。
###### 2. 选择dataspace server进程所在节点，单击“下一步”配置自定义服务部分。
重点配置如下两部分。


![](/pic/51.jpg)


在高级设置cluster-site中，根据要求输入ambari-server所在主机root账户密码、ambari登录root用户密码与ranger登录用户密码。


![](/pic/52.jpg)


在高级设置dataspac-site中，默认dataspace服务所用数据库指定为mysql，填写数据库所在节点主机名称、数据库名称（默认为dataspace）、数据库初始密码、数据库用户名称（建议为root，注意给root赋权）。

[注意]
如果dataspace安装失败，报错关键字中有“KeyError: u'root'Error: Error: Unable to run the custom hook script”，则分别执行如下两条命令（DCenter为集群名称），后重新安装。

	cd /var/lib/ambari-server/resources/scripts
	python configs.py -u admin -p admin -n DCenter -l manager.bigdata.com -t 8080 -a set -c cluster-env -k ignore_groupsusers_create -v true
###### 3. 在Hive中，设置配置参数-Advanced-General，transport mode设置为binary
###### 4. 在Ranger的配置页面开启所有Plugin。

![](/pic/53.jpg)


###### 5. 在Ranger的WebUI页面的“HIVE”页签下单击“DCenter_hive”更改对all-database,udf policy的配置，将database设置为exclude，并保存。

![](/pic/54.jpg)



![](/pic/55.jpg)



![](/pic/56.jpg)


###### 6. 在Ranger的WebUI页面的“HDFS”页签下，单击“DCenter_hadoop”，更改对all-path的配置，在Select User中加入hive和spark，并保存。

![](/pic/57.jpg)



![](/pic/58.jpg)



![](/pic/59.jpg)


###### 7. 在DataSpace组件的配置页面中配置kafka认证信息。
将kafka的keytab文件拷贝到dataspace节点的 /etc/security/keytabs/ 目录。

执行如下命令获取kafka票据信息。

	klist –kt /etc/security/keytabs/kafka.service.keytab
###### 8. 根据上一步获取的信息，配置“高級設置dataspace_jass.conf”页签中的信息。

![](/pic/60.jpg)


###### 9. 设置完成后单击“下一步”，执行安装。
###### 10. 安装完成后可在页面查看dataspace服务，同时点击快速链接可查看服务WebUI。

![](/pic/61.jpg)


DataSpace服务的WebUI如下所示。

![](/pic/62.jpg)


##### 2.1.9.11 Zeppelin部署 (Slave)
Zeppelin部署时，根据安装规划，Zeppelin相关服务部署在slave节点上。
###### 1. 单击页面左侧“…”->“添加服务”，选择Zeppelin并单击“下一步”。
###### 2. 根据安装向导提示信息，执行安装步骤。
###### 3. 安装成功后，有Success标识。
###### 4. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.1.10 开启HA
目前Insight HD中HDFS、YARN、HBase可以开启HA模式，其中，以HDFS开启HA过程最为典型，对于开启YARN HA操作请参考本章开启HDFS HA，其他组件则更为简单直接点击添加按钮即可，本文将不再赘述。
##### 2.1.10.1 进入设置向导操作。点击“服务”菜单中的“HDFS”组件。
##### 2.1.10.2 在“服务操作”中单击“启用NameNode HA”。

![](/pic/h1.jpg)

##### 2.1.10.3 进入“开始设置”向导页，如果Hbase正在运行，则需要停止Hbase服务，在文本框中输入Nameservice ID（例如，mycluster），点击“下一步”。

![](/pic/h2.jpg)

##### 2.1.10.4 进入“选择主机”向导页，指定附加NameNode以及JournalNode部署节点， 配置好后单击“下一步”按钮。

![](/pic/h3.jpg)

##### 2.1.10.5 在“检查”概览界面显示了节点的变化情况，删除Secondary NameNode，添加 Additional NameNode、Journal Node。

![](/pic/h4.jpg)

##### 2.1.10.6 进入“创建检查点”向导页，进行创建checkpoint 操作，此操作需要手工进行，根据提示信息，登录当前NameNode节点，执行显示在页面上的命令，执行完后单击 “下一步”。

![](/pic/h5.jpg)

手工执行命令及返回结果如下所示，表示命令执行成功。

![](/pic/h6.jpg)

##### 2.1.10.7 进入“配置组件”向导页进行相关配置（系统自动完成）。

![](/pic/h7.jpg)

等待1-3min，配置完成后单击“下一步”。

![](/pic/h8.jpg)

##### 2.1.10.8 在“启动NameNode HA向导”页进行初始化Journal Node操作，此操作需要根据提示信息手工进行，登录当前NameNode节点，执行显示在页面上的命令，执行完后，单击“下一步”。

![](/pic/h9.jpg)

##### 2.1.10.9 进入“启动组件”向导页，启动ZooKeeper和NameNode（系统自动完成），完成后单击“下一步”。

![](/pic/h10.jpg)

##### 2.1.10.10 进入“初始化NameNode HA元数据”向导页，初始化NameNode HA 元数据，此操作需要根据提示信息手工进行，登录当前NameNode节点，执行显示在页面上的命令，执行完后单击“下一步”。

![](/pic/h11.jpg)

##### 2.1.10.11 进入“完成HA设置”向导页，启动HA。

![](/pic/h12.jpg)

等待HA设置完成，单击“完成”。

![](/pic/h13.jpg)

##### 2.1.10.12 查看HDFS服务概要界面，会显示HA相关信息，HA安装结束。

![](/pic/h14.jpg)


#### 2.1.11 开启安全模式
 Kerberos KDC安装采用主从模式，主库master位于kylin2.bigdata上，从库slave位于kylin30.bigdata上，安装及配置过程如下。
##### 2.1.11.1 KDC Master安装
###### 1. 安装Kerberos:
	apt-get install krb5-kdc krb5-admin-server
以kylin2为例:

	弹出relam对话框，默认为当前机器名称后缀大写，如:kylin2.bigdata.com，默认值为BIGDATA.COM，保留此默认值。按回车键
	kerberos servers for your realm, 填写kdc主机名，如:kylin2.bigdata.com。按回车键
	Administrative servers for your kerberos realm, 填写kdc主机名:kylin2.bigdata.com。按回车键
	确定，回车。
###### 2. 创建新域:
	sudo krb5_newrealm
###### 3. 修改配置文件
修改krb5.conf

运行命令:

	vi /etc/krb5.conf
修改参数:

	[libdefaults]
	  renew_lifetime = 7d
	  forwardable = true
	  default_realm = BIGDATA.COM
	  ticket_lifetime = 24h
	  dns_lookup_realm = false
	  dns_lookup_kdc = false
	  default_ccache_name = /tmp/krb5cc_%{uid}
	  #default_tgs_enctypes = aes des3-cbc-sha1 rc4 des-cbc-md5
	  #default_tkt_enctypes = aes des3-cbc-sha1 rc4 des-cbc-md5

	[domain_realm]
	  bigdata.com = BIGDATA.COM

	[logging]
	  default = FILE:/var/log/krb5kdc.log
	  admin_server = FILE:/var/log/kadmind.log
	  kdc = FILE:/var/log/krb5kdc.log

	[realms]
	  BIGDATA.COM = {
	    admin_server = kylin2.bigdata.com
	    kdc = kylin2.bigdata.com
	    kdc = kylin30.bigdata.com
	  }
修改kdc.conf

运行命令:

	vi /etc/krb5kdc/kdc.conf
修改参数:

	[kdcdefaults]
	    kdc_ports = 750,88

	[realms]
	    BIGDATA.COM  = {
	        database_name = /var/lib/krb5kdc/principal
	        admin_keytab = FILE:/etc/krb5kdc/kadm5.keytab
	        acl_file = /etc/krb5kdc/kadm5.acl
	        key_stash_file = /etc/krb5kdc/stash
	        kdc_ports = 750,88
	        max_life = 10h 0m 0s
	        max_renewable_life = 7d 0h 0m 0s
	        master_key_type = des3-hmac-sha1
	        supported_enctypes = aes256-cts:normal arcfour-hmac:normal des3-hmac-sha1:normal des-cbc-crc:normal des:normal des:v4 des:norealm des:onlyrealm des:afs3
	        default_principal_flags = +preauth
	    }
修改kadm5.acl

运行命令:

	vi /etc/krb5kdc/kadm5.acl
修改参数:

	admin/admin@BIGDATA.COM *
###### 4. 创建数据库
	kdb5_util create -r BIGDATA –s
###### 5. 创建KDC超级管理员，根据提示信息此处需要输入管理员密码
	kadmin.local -q "addprinc admin/admin@BIGDATA"
###### 6. 启动
运行命令:

	sudo systemctl unmask krb5-admin-server
	sudo systemctl enable krb5-admin-server
启动并查看状态:

	sudo systemctl start krb5-admin-server
	sudo systemctl status krb5-admin-server
###### 7. 测试
运行命令:

	kinit admin/admin
password为admin

查看当前认证用户:

	klist
##### 2.1.11.2 辅助KDC安装
###### 1. 安装
	sudo apt install krb5-kdc krb5-admin-server
###### 2. 修改配置文件
分别修改如下文件（操作与主KDC相同）:

	/etc/krb5.conf
	/etc/krb5kdc/kdc.conf
	/etc/krb5kdc/kadm5.acl

##### 2.1.11.3 主从配置
###### 1. 登录主KDC，运行命令:
	kadmin.local
###### 2. 添加用户
运行命令:  

	addprinc -randkey host/kylin2.bigdata.com
	addprinc -randkey host/kylin30.bigdata.com
###### 3. 主KDC生成keytab文件
运行命令（注意大小写）:

	ktadd -norandkey -k /etc/krb5.keytab host/kylin2.bigdata.com@BIGDATA.COM host/kylin30.bigdata.com@BIGDATA.COM
###### 4. 运行 quit 退出
###### 5. 将keytab发送到辅助KDC
以发送到kylin30为例，在主KDC节点运行命令:

	scp /etc/krb5.keytab root@kylin30.bigdata.com:/etc
###### 6. 列出keytab
运行命令:

	sudo klist -k /etc/krb5.keytab
###### 7. 主从机均编辑kpropd.acl文件
运行命令:
	vi kpropd.acl
加入:

	host/kylin2.bigdata.com@BIGDATA.COM
	host/kylin30.bigdata.com@BIGDATA.COM
###### 8. 辅助KDC上创建空数据库
运行命令:

	sudo kdb5_util -s create
###### 9. 启动kpropd守护程序
运行命令:

	sudo kpropd -S
###### 10. 创建主体数据库的转储文件
运行命令:

	sudo kdb5_util dump /var/lib/krb5kdc/dump
###### 11. 主KDC数据库转推到辅助KDC
运行命令:

	sudo kprop -r BIGDATA.COM -f /var/lib/krb5kdc/dump kylin30.bigdata.com
运行成功会有SUCCEEDED信息:

	Database propagation to kylin30.bigdata.com: SUCCEEDED

###### 12. 定时推送数据库到辅助KDC
运行命令:

	crontab -e
加入内容:

	2 * * * * /usr/sbin/kdb5_util dump /var/kerberos/krb5kdc/dump && /usr/sbin/kprop -r BIGDATA -f /var/kerberos/krb5kdc/dump kylin30.bigdata.com
###### 13. 在辅助KDC创建一个存储文件以保存Kerberos主密钥
运行命令:

	sudo kdb5_util stash
结果: Using existing stashed keys to update stash file.
###### 14. 在辅助KDC上启动krb5-kdc守护程序
运行命令:

	sudo systemctl start krb5-kdc.service
##### 2.1.11.4 Kerberos客户端
###### 1. 安装krb5-user和libpam-krb5等包
运行命令:
	sudo apt install krb5-user libpam-krb5 libpam-ccreds auth-client-config
###### 2. 配置
运行命令:

	sudo dpkg-reconfigure krb5-config
确保/etc/krb5.conf中有以下内容:

	[libdefaults]
	    default_realm = BIGDATA.COM...
	[realms]
	  BIGDATA.COM = {
	    admin_server = kylin2.bigdata.com
	    kdc = kylin2.bigdata.com
	    kdc = kylin30.bigdata.com
	  }
###### 3. 测试
运行命令:

	kinit admin/admin@BIGDATA.COM
查看详情:

	klist
###### 4. 使用auth-client-config来配置libpam-krb5模块，使得在登录时请求票据:
运行命令:

	sudo auth-client-config -a -p kerberos_example


### 2.2 问题
#### 2.2.1 重置root密码时，报错 Plugin 'auth_socket' is not loaded
需要将auth插件更改为

	mysql_native_password

免密登录数据库后，运行如下命令:

	use mysql;
	update user set authentication_string=PASSWORD('bigdata') where User='root';
	update user set plugin="mysql_native_password" where User='root';
	flush privileges;
	exit
重启mysql登录即可。
#### 2.2.2 Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'
原因在于/var/run下面没有mysqld目录。

解决方法:

	mkdir -p /var/run/mysqld
	chown mysql /var/run/mysqld/
	service mysql restart
#### 2.2.3 DNS错误:
修改host:

	vi /etc/hosts
#### 2.2.4 REASON: Unable to detect a system user for Ambari Server.
运行命令:

	vi /etc/ambari-server/conf/ambari.properties
添加内容:

	ambari-server.user=root
#### 2.2.5 ambari-servers 启动失败
运行 ambari-server start时报错 no valid keyboard

原因: 缺少 /var/lib/ambari-server/keys/db/newcerts

运行命令:

	mkdir -p /var/lib/ambari-server/keys/db/newcerts

#### 2.2.6 报错 UnicodeDecodeError: 'ascii' codec can't decode byte 0xe6 in position 1: ordinal not in range(128)
在报错的.py文件开头添加:

	import sys
	reload(sys)
	sys.setdefaultencoding('utf-8')

#### 2.2.7 HDFS NameNode启动报错: Execution of '/usr/hdp/current/hadoop-hdfs-namenode/bin/hdfs dfsadmin -fs hdfs://kylin2.bigdata.com:8020 -safemode get | grep 'Safe mode is OFF'' returned 1.
原因:

NameNode Server threads 参数值400

修改为200后正常启动。

#### 2.2.8 HDFS NameNode启动报错: Exiting with status 1: java.lang.OutOfMemoryError: unable to create new native thread
原因: cgroup 限制，需要修改系统参数。

运行命令:

	vi /etc/systemd/system.conf
DefaultTasksMax默认值512，修改为:

	DefaultTasksMax=65535

	vi /etc/systemd/logind.conf  
UserTasksMax默认值12288，修改为:

	UserTasksMax=65535
#### 2.2.9 mysql主从配置slave节点slave start报错: ERROR 1872 (HY000): Slave failed to initialize relay log info structure from the repository
由于mysql.slave_relay_log_info表中保留了以前的复制信息，导致新从库启动时无法找到对应文件，需要清理掉该表中的记录。

运行命令:

	slave reset;
再重新运行change master...


## 第三章 集群高可用测试
### 3.1 HDFS测试
#### 3.1.1 主从替换测试
##### 3.1.1.1查看节点状态
	hdfs haadmin -getServiceState nn1
		active
	hdfs haadmin -getServiceState nn2
		standby
都为standby时，需要手动将一个节点从standby切换为active，以nn1为例:

	hdfs haadmin -transitionToActive  --forcemanual nn1
##### 3.1.1.2 关闭nn1进程
在nn1主机运行命令:

	jps
找到NameNode进程号并关闭

	kill -9 进程号
查看nn2进程号，发现从standby转为active

	hdfs haadmin -getServiceState nn2
		active
##### 3.1.1.3 重新开启nn1
	find / -name hadoop-daemon.sh
找到文件位置并运行:

	/usr/hdp/3.1.0.0-78/hadoop/sbin/hadoop-daemon.sh start namenode
##### 3.1.1.4 再次查看节点状态:

	hdfs haadmin -getServiceState nn1
		standby
	hdfs haadmin -getServiceState nn2
		active

#### 3.1.2 NameNode测试
##### 3.1.2.1 切换到hdfs用户

	su hdfs
##### 3.1.2.2 本地准备用于传输的文件，存放在路径 /tmp/uploadtest 中

![](/pic/781.png)


##### 3.1.2.3 集群上新建测试文件夹datatest
	hdfs dfs -mkdir /datatest
##### 3.1.2.4 本地文件传到集群
	hdfs dfs -put /tmp/uploadtest/ /datatest
##### 3.1.2.5 手动停止namenode后，报错信息如下:

![](/pic/72.png)


##### 3.1.2.6 查看集群文件

![](/pic/73.png)


运行命令:

	hdfs dfs -ls /datatest
	hdfs dfs -ls /datatest/uploadtest

![](/pic/74.png)


##### 3.1.2.7 本地新建文件夹 /tmp/localtest，将传输到集群中的文件下载到新文件夹
	mkdir tmp/localtest
	hdfs dfs -copyToLocal /datatest/uploadtest /tmp/localtest
##### 3.1.2.8 查看下载文件
	cd /tmp/localtest
	ll
	cd uplaodtest
	ll

![](/pic/75.png)

##### 3.1.2.9 比较新文件与上传文件的差异
	diff /tmp/localtest/uploadtest /tmp/uploadtest
结果显示无差异

![](/pic/76.png)


#### 3.1.3 DataNode测试
##### 3.1.3.1 切换到hdfs用户
	su hdfs
##### 3.1.3.2 本地准备用于传输的文件，存放在路径 /tmp/uploadtest 中

![](/pic/781.png)

##### 3.1.3.3 集群上新建测试文件夹datatest1，本地文件传到集群
	hdfs dfs -mkdir /datatest1
	hdfs dfs -put /tmp/uploadtest/ /datatest1
以3个DataNode的集群为例。

![](/pic/82.png)

##### 3.1.3.4 手动关闭一个DataNode节点，UI界面如下所示:

![](/pic/83.png)


##### 3.1.3.5 后台报错信息如下:

![](/pic/84.png)


##### 3.1.3.6 UI最终显示文件

![](/pic/85.png)


##### 3.1.3.7 运行命令查看集群文件
	hdfs dfs -ls /datatest1
	hdfs dfs -ls /datatest1/uploadtest

![](/pic/86.png)

##### 3.1.3.8 本地新建文件夹 /tmp/localtest1，将传输到集群中的文件下载到新文件夹
	mkdir tmp/localtest1
	hdfs dfs -copyToLocal /datatest1/uploadtest /tmp/localtest1
##### 3.1.3.9 查看下载文件
	cd /tmp/localtest1
	ll
	cd uplaodtest1
	ll

![](/pic/87.png)


##### 3.1.3.10 比较新文件与上传文件的差异
	diff /tmp/localtest1/uploadtest /tmp/uploadtest
结果显示无差异

![](/pic/88.png)


### 3.2 YARN主备节点切换测试
#### 3.2.1 切换到yarn用户
	su yarn
#### 3.2.2 查看节点状态
	yarn rmadmin -getServiceState rm1
		active
	yarn rmadmin -getServiceState rm2
		standby
#### 3.2.3 关闭YARN进程
找到ResourceManager进程号

	jps
	kill -9 进程号
查看状态:

	yarn rmadmin -getServiceState rm2
		active
#### 3.2.4 重启YARN进程
找到并运行yarn-daemon.sh文件启动ResourceManager

	find / -name yarn-daemon.sh
	/usr/hdp/3.1.0.0-78/hadoop-yarn/sbin/yarn-daemon.sh start resourcemanager
#### 3.2.5 再次查看节点状态:

	yarn rmadmin -getServiceState rm1
		standby
	yarn rmadmin -getServiceState rm2
		active


常见问题FAQ


登录时不是root用户，则需要开启root：

ssh -q -l inspur -p 22 10.110.56.220
1. 初始化root密码：
sudo passwd root
2. 将PermitRootLogin项prohibit-password改为yes:
sudo vi /etc/ssh/sshd_config
PermitRootLogin=yes 
3. 重启sshd服务即可:
service sshd restart

安装ntp时80端口被apache2占用：
journalctl -xe
netstat -anp|grep 80
systemctl status apache2
systemctl stop apache2


root@master1:~# service ntpdate stop
Failed to stop ntpdate.service: Unit ntpdate.service not loaded.
root@master1:~# service ntp stop
root@master1:~# ntpdate manager.bigdata.com
25 Nov 17:04:27 ntpdate[4930]: adjust time server 172.16.15.220 offset 0.001752 sec