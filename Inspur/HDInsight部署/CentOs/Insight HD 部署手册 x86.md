# 基于x86的浪潮云HD部署

## 第一章 硬件信息

操作系统: CentOS 7

芯片：x86

## 第二章 部署安装

### 2.1 准备环境

1. 安装源： 
	http://10.221.129.22/InspurHD1.0/

2. 资源列表：
	10.221.129.30 root/Bigdata123?

#### 2.1.1 修改主机名 (集群所有节点均需执行此操作)

1. 通过Shell连接主机

	```ssh root@22 10.221.129.30```

	![登录主机](/pic/1登录主机.png)

2. 修改主机名，如:  

	```hostnamectl set-hostname manager.bigdata.com```

3. 查看主机名:

	```cat /etc/hostname```

	![修改主机名](/pic/2修改主机名.png)

#### 2.1.2 修改ip与域名的对应关系 (集群所有节点均需执行此操作)

1. 运行命令	
	```vi /etc/hosts```

	添加集群内所有节点的ip以及对应主机名：

	```
	10.221.129.30 manager.bigdata.com manager
	10.221.129.31 master1.bigdata.com master1
	10.221.129.32 worker1.bigdata.com worker1
	```

2. 查看修改是否成功:
	```cat /etc/hosts```

	
	![修改hosts文件](/pic/3修改hosts文件.png)

3. 将修改好的配置文件分发到集群中其他节点: 
	```
    
    scp /etc/hosts root@manager.bigdata.com:/etc
    scp /etc/hosts root@master1.bigdata.com:/etc
    scp /etc/hosts root@worker1.bigdata.com:/etc
    ...
    
	```

4. 运行 ```reboot``` 命令重启，之后重新登录

	![重启并重新登录](/pic/4重启并重新登录.png)

#### 2.1.3 关闭seLinux (集群所有节点均需执行此操作)

1. 暂时关闭:
	
	```setenforce 0```

2. 永久关闭:
	
	```vi /etc/selinux/config```

	SELinux设置为:

	```SELINUX=disabled```

	![关闭seLinux](/pic/5关闭seLinux.png)

#### 2.1.4 关闭Linux透明大页 (集群所有节点均需执行此操作)

1. 暂时关闭:

	```echo never > /sys/kernel/mm/transparent_hugepage/enabled```

2. 开机关闭: 

	```vi /etc/rc.local```

	加入代码:
	```
	if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
		echo never > /sys/kernel/mm/transparent_hugepage/enabled
	fi
	```

	![关闭透明大页](/pic/6关闭透明大页1.png)

3. 查看透明大页是否已经关闭:

	```cat /sys/kernel/mm/transparent_hugepage/enabled```

	显示如下内容说明透明大页已经关闭:

	```always madvise [never]```

	![关闭透明大页](/pic/6关闭透明大页2.png)

#### 2.1.5 关闭防火墙 (集群所有节点均需执行此操作)

1. 禁用防火墙:
    
	``` systemctl stop firewalld.service```
    
2. 开机关闭:
    
        ``` systemctl disable firewalld.service ```

3. 查看防火墙状态:

	``` firewall-cmd --state ```

	![禁用防火墙](/pic/7禁用防火墙.png)

#### 2.1.6 打通SSH (mannager节点需执行此操作)

server端要通过ssh协议将软件包分发到集群中各节点上，所以要打通server端到集群中各节点的ssh。

1. Shell登录Manager节点

	```ssh root@22 10.221.129.30```

2. 打通ambari-server端到集群中所有节点的ssh（必须打通自身，否安装hdp时会失败）:

	```
	ssh-keygen
	ssh-copy-id root@manager.bigdata.com
	ssh-copy-id root@master1.bigdata.com
	ssh-copy-id root@worker1.bigdata.com
	```

	![打通ssh](/pic/8打通ssh.png)

### 2.2 源配置 (集群所有节点均需执行此操作)

#### 2.2.1 源文件修改

1. 修改ambari源
运行命令:

``` vi /etc/yum.repos.d/ambari.repo```

内容如下所示:

```
#VERSION_NUMBER=2.7.1.0
[ambari-2.7.1.0]
name=ambari Version - ambari-2.7.1.0
baseurl=http://10.221.129.22/InspurHD1.0/manager/
gpgcheck=0
enabled=1
priority=1
```

2. 修改mysql源
    运行命令：
    
    ``` vi /etc/yum.repos.d/mysql.repo```
    
    内容如下所示：
    
    ```
    #VERSION_NUMBER=5.6
    [mysql-5.6]
    name=mysql - 5.6
    baseurl=http://10.221.129.22/InspurHD1.0/mysql/
    gpgcheck=0
    enabled=1
    priority=1
    ```

    3. 修改CentOS源
    运行命令：
    
    ``` vi /etc/yum.repos.d/CentOS.repo```
    
    内容如下所示：
    
    ```
    #CentOS=7.3
    [CentOS-7.3]
    name=centos7.3
    baseurl= http://10.221.129.22/centos7.3/
    gpgcheck=0
    enabled=1
    priority=1

    ```

#### 2.2.2 源更新
1. 运行命令:

	```yum clean all```
        ```yum update```


### 2.3 ntp时间同步 (集群所有节点均需执行此操作)

集群中各节点从managerNode节点同步时间，managerNode节点从标准时钟服务器同步时间。当managerNode节点出现故障时，各节点从masterNode节点同步时间。

![ntp](/pic/ntp.jpg)

#### 2.3.1 安装ntp服务

安装ntp，若存在未安装的依赖包则会提示安装

```yum -y install ntp*```

#### 2.3.2 修改ntp配置文件

输入命令修改ntp配置
```vi /etc/ntp.conf```

集群各类节点ntp.conf配置文件内容如下所示：

1. manager节点:

	```
    restrict 192.168.6.0 mask 255.255.255.0 nomodify notrap 
    server 192.168.0.1 prefer
    server 127.127.1.0
    fudge 127.127.1.0 stratum 8

	```

	> 参数说明:

	```192.168.6.0``` 和 ```255.255.255.0``` 是集群所在网段的网关和子网掩码。

	```192.168.0.1``` 是主时钟源的IP地址，请根据实际情况替换，```prefer``` 表示优先选择的时钟源。

2. master节点:

	```
    restrict 192.168.6.0 mask 255.255.255.0 nomodify notrap 
    server manager.bigdata.com prefer
    server 127.127.1.0
    fudge 127.127.1.0 stratum 9

	```

3. worker节点和slave节点:

	```
	server manager.bigdata.com prefer
	server master1.bigdata.com
	server master2.bigdata.com
	```

#### 2.3.3 使master、worker、slave节点从manager节点同步时间

在master、worker、slave节点执行如下命令从manager节点同步时间:

```/usr/sbin/ntpdate manager.bigdata.com```

#### 2.3.4 启动ntp服务

``` systemctl start ntpd.service ```

#### 2.3.5 设置开机启动ntp服务

```systemctl enable ntpd.service ```

#### 2.3.6 查看ntp状态

```ntpq -p```

### 2.4 openjdk安装 (集群所有节点均需执行此操作)

1. 创建并切换到jdk64文件夹

	```mkdir /usr/jdk64```
	```cd /usr/jdk64```

2. 获取openjdk包:

	```wget http://10.221.129.22/InspurHD1.0/jdk/jdk-1.8.0-232.tar.gz```

3. 解压openjdk包:

	```tar -zxvf jdk-1.8.0-232.tar.gz```

	添加jce包：

	```cp /usr/jdk64/jdk-1.8.0-232/jre/lib/security/policy/unlimited/* /usr/jdk64/jdk-1.8.0-232/jre/lib/security/```

4. 配置环境变量

	编辑环境变量配置文件:

	```vi /etc/profile```

	添加内容:

	```
	export JAVA_HOME=/usr/jdk64/jdk-1.8.0-232
	CLASSPATH=.:$JAVA_HOME/lib:$JAVA_HOME/lib/mysql-connector-java.jar
	export PATH=$PATH:$JAVA_HOME/bin
	```

5. 运行命令更新环境变量:

	```source /etc/profile```

### 2.5 安装JDBC驱动文件 (集群所有节点均需执行此操作)

1. 下载mysql-connector-java-5.1.47.jar

	```cd /usr/share/java```
	```wget http://10.221.129.22/InspurHD1.0/jdk/mysql-connector-java-5.1.48.jar```

2. 查看文件:

	```ll```
    /usr/share/java/mysql-connector-java-5.1.48.jar

### 2.7 安装配置MySQL (数据库节点需执行此操作，此处manager为主节点)

#### 2.7.1 安装和初始化

1.    安装MySQL 5.6

    Step1：执行如下命令卸载mysql-libs
        yum -y remove mysql-libs
    
    Step2：安装mysql依赖包
        yum -y install perl-Data-Dumper
        
    Step3：执行如下命令安装MySQL安装包
        yum -y install MySQL*

    Step4：配置数据库
        执行如下命令编辑mysql配置文件my.cnf
        vi /etc/my.cnf
        配置信息如下所示:
        [mysqld]
        datadir=/var/lib/mysql
        #socket=/var/lib/mysql.sock
        skip-grant-tables
        user=mysql
        symbolic-links=0
        log_bin_trust_function_creators=1
        log-bin=mysql-bin
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
        pid-file=/var/lib/mysql/mysqld.pid
        replicate-do-db=all
        [注意]skip-grant-tables参数为免密码登录，登录后请立刻初始化mysql的root密码，并给root用户赋权，完成后需要把免密码登录的参数skip-grant-tables从/etc/my.cnf中删除。


2. 启动数据库:

	```systemctl start mysql.service```

3. 查看是否启动成功:

	```systemctl status mysql.service```

4. mysql5.7安装时会提示设置root密码，默认密码为空。将root用户密码修改为bigdata:

	```mysql -uroot -p```
	```use mysql;```
	```UPDATE user SET Password = 'bigdata' WHERE User = 'root';```
    ```FLUSH PRIVILEGES; ```

5. 授权root用户在其他节点访问数据库的权限:

	```GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'bigdata' WITH GRANT OPTION;```
	```FLUSH PRIVILEGES;```

6. 修改/etc/my.cnf配置文件，删除或注释掉skip-grant-tables并重启数据库:

    ```vi /etc/my.cnf```
    
    ```#skip-grant-tables```
    
	```systemctl restart mysql.service```

7. 登录数据库，执行如下命令验证数据库编码是否为utf-8:

	 ```show variables like 'char%';```

	若数据库编码是否不是utf-8，运行如下命令：

	```vi /etc/mysql/mysql.conf.d/mysqld.cnf```

	如果需要修改为utf8，在 ```lc-messages-dir = /usr/share/mysql``` 语句后加入:

	```
	character-set-server = utf8
	```
	
8. 将数据库配置为允许远程连接

	```vi /etc/mysql/mysql.conf.d/mysqld.cnf```
	
	配置修改如下：
	```
	skip-external-locking
	bind-address = 0.0.0.0
	```

#### 2.7.2 MySQL主从配置

1. 在数据库主节点创建同步用户sync

    ```create user 'sync'@'%' identified by 'bigdata';```

2. 给sync用户赋予主从复制权限

	```grant replication slave on *.* to 'sync'@'%' identified by 'bigdata' with grant option;```

3. 在数据库从节点验证sync用户登录主节点mysql数据库
	登录数据库*从节点*所在的主机，连接*主节点*mysql数据库：

    ```mysql -usync -pbigdata -hmanager.bigdata.com```

4. 配置主从、节点的 ```/etc/my.cnf``` 文件
	主节点 ```/etc/my.cnf``` 文件配置内容如下所示：

	```
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

	```

	说明：需要做备份的数据库通过“binlog-do-db=ambari”参数进行配置。

	从节点 ```/etc/my.cnf``` 文件配置内容如下所示：

	```
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

	```

5. 分别登录主、从节点，重启MySQL服务

	```service mysql restart```

6. 登录主节点的mysql数据库，执行如下命令查看master节点状态

	```show master status;```

7. 执行以下命令登录从节点的mysql

	```mysql -uroot -pbigdata```

8. 执行以下命令关闭slave

	```stop slave;```

9. 执行以下命令配置从节点要同步的主节点信息

	```change master to master_host='10.110.17.209', master_user = 'sync', master_password = 'bigdata', master_log_file = 'mysql-bin.000003', master_log_pos = 120;```

	参数解释说明如下：

	```master_user```为同步用户；
	```master_log_file```和```master_log_pos```为主节点执行完```show master status```后系统返回的参数。

10. 在从节点启动mysql从节点

	```start slave;```

11. 在从节点验证mysql从节点的状态是否成功

	```show slave status;```

	返回结果中以下两项都为yes，说明配置成功：

	```
	Slave_IO_Running: Yes
	Slave_SQL_Running: Yes
	```

12. 主节点解锁
	```unlock tables;```

### 2.8 在manager上安装ambari

#### 2.8.1 准备环境

创建ambari数据库及ambari用户并赋权

1. 通过shell登录集群的manager节点

	```ssh root@10.221.129.30```

2. 连接mysql数据库

	```mysql -uroot -pbigdata```

3. 创建ambari数据库

	```create database ambari;```

4. 创建ambari用户并赋权，```manager.bigdata.com``` 根据实际情况改为对应的hostname

	```grant all privileges on *.* to 'ambari'@'manager.bigdata.com' identified by 'bigdata' with grant option;```

	```FLUSH PRIVILEGES;```
    
```[注意]：安装过程中出现的异常会有提示信息，请根据提示信息做相应操作。提示信息不明确的可以查看后台日志，日志文件存放路径：/var/log/ambari-server/ambari-server.log
   ```

#### 2.8.2 安装ambari-server

运行命令:

```yum install ambari-server```

#### 2.8.3 初始化ambari

env | grep jdk 查看jdk

1. 运行命令:

	```ambari-server setup```

	配置过程中选项如下:
	```
	Customize user ... daemon: n
	JDK: 2
	JAVA_HOME:/usr/jdk64/jdk-1.8.0-232
	GPL: y
	database configuration: y
	3 (mysql选项)
	Hostname: 主机的hostname(如:manager.bigdata.com)
	Port: 3306
	Database name: ambari
	Username: ambari
	Password: bigdata
	jdbc: n
	输入: /usr/share/java/mysql-connector-java-5.1.48.jar
	```

	若在配置时没有jdbc选项，需要继续运行如下命令配置jdbc:

	```ambari-server setup --jdbc-db=mysql --jdbc-driver=/usr/share/java/mysql-connector-java-5.1.48.jar```

2. 执行sql脚本

	登录数据库:

	```mysql -uroot -pbigdata```

	运行命令:

	```use ambari;```

	```source /var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql;```

#### 2.8.4 启动ambari-server

1. 启动ambari:

	```ambari-server start```

	```/etc/ambari-server/conf/ambari.properties```

2. 测试登录
	打开浏览器，以manager(10.221.129.30)为例，输入 http://10.221.129.30:8080/ 登陆web页面成功表示manager安装成功

### 2.9 部署组件

#### 2.9.1 准备环境

1. 配置MySQL

	提前配置好 ```Hive```、 ```Oozie``` 、```Ranger```所对应的数据库，并对相应用户授予权限：

	```root```用户登录```MySQL```：

	(1) Hive组件:

		create database hive;
		use hive;
		grant all privileges on hive.* to 'hive'@'%' identified by 'bigdata';
		flush privileges;

必须重新执行 ambari-server setup --jdbc-db=mysql --jdbc-driver=/usr/share/java/mysql-connector-java-5.1.48.jar

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
	
2. 开启 ```innodb``` 表索引字符串最大长度限制（如若不执行此步骤，则 ```ranger``` 启动失败）

	```
	mysql -uroot -pbigdata
	use mysql;
	set global innodb_file_format = BARRACUDA;
	set global innodb_large_prefix = ON;
	```

> 注意：各组件依赖关系如下图所示，在安装部署过程中，有依赖关系的组件注意先部署被依赖的组件。

![](/pic/yilai.png)

建议各组件安装顺序如下：

> Zookeeper --> HDFA --> HD Metrics --> Yarn + MapReduce --> (...其他组件...) --> Kerberos

安装过程中出现的异常会有提示信息，请根据提示信息做相应操作。

可以在 ```/var/log/组件名/``` 中查看安装日志，便于排查错误。

访问快速链接查看安装成功的WebUI，如果登录WebUI的主机没有配置 ```IP``` 和 ```hostname``` 的映射关系，在链接到组件WebUI界面时需要把域名更换成IP地址。

#### 2.9.2 安装源信息

    •    HDP-3.0：http://10.221.129.22/InspurHD1.0/hdp/
    •    HDP-3.0-GPL: http://10.221.129.22/InspurHD1.0/hdp-gpl/
    •    HDP-SOLR-4.0.0-400: http://10.221.129.22/InspurHD1.0/hdp-solr/
    •    HDP-UTILS-1.1.0.22：http://10.221.129.22/InspurHD1.0/hdp-utils/

#### 2.9.3 常规组件部署（HDFS、ZooKeeper、HD Metrics、YARN + MapReduce2）

1. 登录Web页面

	在浏览器中输入 http://10.200.72.2:8080/ 进入登录页面（ip地址修改为对应值）。

	登录账密: admin admin

	![](/pic/11.jpg)


2. 点击“启动安装向导”按钮，进行Insight HD部署。

3. 在“开始”向导页输入要创建的集群名称，点击“下一步”。

	![](/pic/12.jpg)

4. 进入“选择版本”向导页，版本信息选择: HDP-3.1.0.0，并选择使用本地存储库。输入本地源地址，操作系统选择: kylin4 （其他操作系统版本移除）。单击“下一步”。

	URL对应输入源地址:

	```
	HDP: http://10.221.129.22/kylin-arm64/hortonworks/HDP/kylin4/3.1.0.0-78/
	HDP-GPL: http://10.221.129.22/kylin-arm64/hortonworks/HDP-GPL/kylin4/3.1.0.0-78/
	HDP-UTILS: http://10.221.129.22/kylin-arm64/hortonworks/HDP-UTILS/kylin4/1.1.0.22/
	```

5. 在“安装选项”向导页中注册及确认主机。

	(1)	在目标主机文本框中输入ambari-agent各节点hostname，如:manager.bigdata.com（每行输入一个节点的hostname即可）。

	(2)	在主机注册信息中输入SSH私钥信息。

	单击“选择文件”，选择路径 ```/root/.ssh/id_rsa```来配置私钥。

	单击“注册和确认”。

	![](/pic/14.jpg)

	(安装完成后查看问题列表，最好解决掉所有警告)

6. 在“确认主机”向导页中，确认主机信息并安装ambari-agent相关进程。

	![](/pic/15.jpg)

	安装完成后，进度条会呈现绿色，状态栏信息会显示“Success”。

	![](/pic/16.jpg)

	点击提示信息“点击此处查看警告”，出现详细问题列表，建议将警告全部解决，便于此后集群的后续安装。

	![](/pic/17.jpg)

7. 在“选择服务”向导页中选择需要安装的组件。

	建议先同时安装HDFS、ZooKeeper、HD Metrics和YARN + MapReduce2，勾选完成后单击“下一步”，后续其他组件单独安装。

	![](/pic/18.jpg)

	> 说明：对于有依赖关系的组件，会有相关提示信息；同时，对未勾选的组件，集群安装完成后也可进行后续安装。

8. 在“指定Master”向导页中指定所选组件Master进程所在节点。

	可完全采用默认设置，同时也可自定义进程要安装的节点。
	
	点击每个进程对应的下拉框，在下拉框显示的所有agent节点中进行选择。设置完成后点击“下一步”。

	![](/pic/19.jpg)

	> 说明：对于后面有绿色加号的组件，可以增加集群节点进行部署。

9. 在“指定Slaves和Client”向导页中指定所选组件Slaves或Client进程的所在节点。

	可完全采用默认设置，也可进行自定义设置。
	
	“主机”一栏显示当前可用的agent节点，对每个agent节点，勾选要安装的服务（说明：NFSGateway不需要安装）设置完成后单击“下一步”。

	![20](/pic/20.jpg)

	> 说明：slave和client的可选组件在右边显示，请将水平滚动条拖动到最右端进行查看。

10. 在“自定义服务”向导页检查各个组件需要的配置是否完备。

	对于需要用户手工配置或者配置存在问题的组件会在“CREDENTIALS”中创建。

	![](/pic/21.jpg)

11. 进入“检查”向导页，检查配置信息，审查无误后，单击“部署”，进行组件安装。

	![](/pic/22.jpg)

	![](/pic/23.jpg)

	> 注意: “检查”页签的“库”区域下的 **”redhat7(HDP-3.1)“** 和 **”redhat7(HDP-UTILS-1.1.0.22)“** 的值不能为空，如果为空，不要单击”部署“，刷新一下此页，此处的值便可以正常写入，然后单击”部署“即可。

12. 进入“安装、启动和测试”向导页，此过程中组件自动安装、启动和调试。

	![](/pic/24.jpg)

	安装完成后节点状态显示100%，消息提示“成功”。点击【下一步】查看概览。

	![](/pic/25.jpg)

13. “概览”向导页提供了集群安装过程的概况，如果服务安装过程无异常，集群安装即成功。

14. 点击“完成”进入集群的控制台页面可监控集群。

	同时，如果启动或测试过程出现问题，也会提示相关警告信息。

	![](/pic/26.jpg)


#### 2.9.4 HBase部署

```HMaster``` 服务部署在Master节点上，```RegionServer``` 服务部署在Worker节点上，如果有其他服务则部署在manager节点上。

1. 单击页面左侧“…”->“添加服务”，选择HBase并单击“下一步”。

	![](/pic/31.jpg)

2. 根据安装向导提示信息，执行安装步骤。

3. 安装成功后，有Success标识。

4. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.9.5 Hive部署 (Manager)

Hive部署在manager节点上，Hive依赖HDFS、Yarn+MapReduce、Tez。其中HDFS、Yarn+MapReduce的已安装，Tez组件在安装Hive时会提示自动安装。

1. 单击页面左侧“…”->“添加服务”，选择Hive并单击“下一步”。

	![](/pic/31.jpg)

	![](/pic/32.jpg)

2. 根据安装向导提示信息，执行安装步骤（请提前创建Hive数据库和用户及赋权）。

3. 在“自定义服务”向导页，根据提示信息，配置数据库相关信息。

	![](/pic/33.jpg)

	数据库选项选择 Exciting MySQL/MariaDB

	输入数据库的账号密码（根据之前的设置，均为bigdata）

	运行命令:

		ambari-server setup --jdbc-db=mysql --jdbc-driver=/usr/jdk64/jdk1.8.0_221/lib/mysql-connector-java.jar
	点击TEST CONNECTION测试是否能连上数据库。

4. 安装成功后，有Success标识。

	![](/pic/34.jpg)

	![](/pic/35.jpg)

5. 安装完成后，执行如下语句对Hive数据库执行utf8编码:

	```
	mysql -uhive -pbigdata
	use hive;
	alter table COLUMNS_V2 modify column COMMENT varchar(256) character set utf8;
	alter table TABLE_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8;
	alter table PARTITION_KEYS modify column PKEY_COMMENT varchar(4000) character set utf8;
	alter table TBLS modify column VIEW_ORIGINAL_TEXT mediumtext character set utf8;
	alter table TBLS modify column VIEW_EXPANDED_TEXT mediumtext character set utf8;
	```

6. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.9.6 Spark2部署 (Manager)

Spark部署时，根据安装规划，Spark相关服务部署在manager节点上。

1. 单击页面左侧“…”->“添加服务”，选择Spark并单击“下一步”。

2. 根据安装向导提示信息，执行安装步骤。

3. 安装成功后，有Success标识。

4. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.9.7 Oozie部署 (Manager)

Oozie部署时，根据安装规划，Oozie相关服务部署在 ```manager``` 节点上。

1. 单击页面左侧“…”->“添加服务”，选择 ```Oozie``` 并单击“下一步”。

2. 根据安装向导提示信息，执行安装步骤（请提前创建**Oozie数据库和用户及赋权**）。

	> 根据之前的设置，数据库账号密码为: ```bigdata``` ```bigdata```

	点击 ```TEST CONNECTION``` 测试是否能连上数据库。

3. 安装成功后，有Success标识。

4. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.9.8 Ranger部署(Manager)

Ranger部署时，根据安装规划，Ranger相关服务部署在```manager```节点上。

1. 单击页面左侧“…”->“添加服务”，选择 ```Ranger``` 并单击“下一步”。

	![](/pic/41.jpg)

2. 根据安装向导提示信息，执行安装步骤（请提前创建**Ranger数据库和用户及赋权**）。

	![](/pic/42.jpg)

	以 ```manager``` 为例:

		DB Flavor: MYSQL
		Ranger DB host: manager.bigdata.com
		Ranger DB Password: bigdata
		DBA username: root
		DBA password: bigdata

3. 安装过程中，请将 ```“Ranger Plugin”``` 页签中，各组件的插件 ```plugin``` 打开。

	![](/pic/43.jpg)

4. 安装过程中，请将 ```“Ranger Audit”``` 页签的 ```“Audit to Solr”``` 和 ```“Audit to HDFS”``` 选项关掉。

	![](/pic/44.jpg)

5. 配置 ```“ADVANCED”``` 页签中 ```“高级设置ranger-env”``` 区域的内容。

	![](/pic/45.jpg)

6. 安装成功后，有 ```Success``` 标识。

7. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.9.9 Sqoop部署 (Manager)

Sqoop部署时，根据安装规划，Sqoop相关服务部署在manager节点上。

1. 单击页面左侧“…”->“添加服务”，选择Sqoop并单击“下一步”。

2. 根据安装向导提示信息，执行安装步骤。

3. 安装成功后，有Success标识。

4. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

#### 2.9.10 Zeppelin部署 (Slave)

Zeppelin部署时，根据安装规划，Zeppelin相关服务部署在slave节点上。

1. 单击页面左侧“…”->“添加服务”，选择Zeppelin并单击“下一步”。

2. 根据安装向导提示信息，执行安装步骤。

3. 安装成功后，有Success标识。

4. 若安装失败或者启动失败，请根据提示信息或者后台日志定位问题。

### 2.10 启动Kerberos安全认证

#### 2.10.1 KDC Master安装

Kerberos KDC安装采用主从模式，主库master必须位于manager.bigdata上，从库slave位于master1.bigdata上，安装及配置过程如下。

1. 登录待安装KDC的主节点所在主机，安装KDC必要的安装包。

yum -y install krb5-libs krb5-server krb5-workstation

2. 编辑配置文件/etc/krb5.conf，内容如下。（注红色部分为需要修改的内容）

[libdefaults]
default_realm = BIGDATA
ticket_lifetime = 3000d
new_lifetime = 3000d
forwardable = true
dns_lookup_realm = false
dns_lookup_kdc = false
default_ccache_name = /tmp/krb5cc_%{uid}
#default_tgs_enctypes = aes des3-cbc-sha1 rc4 des-cbc-md5
#default_tkt_enctypes = aes des3-cbc-sha1 rc4 des-cbc-md5
[domain_realm]
.bigdata.com = BIGDATA
[logging]
  default = FILE:/var/log/krb5kdc.log
  admin_server = FILE:/var/log/kadmind.log
  kdc = FILE:/var/log/krb5kdc.log
[realms]
  BIGDATA = {
    admin_server = manager.bigdata.com
    kdc = manager.bigdata.com
    kdc = master.bigdata.com
}

3.	编辑/var/kerberos/krb5kdc/kdc.conf文件，内容如下。
[kdcdefaults]
 kdc_ports = 88
 kdc_tcp_ports = 88
[realms]
 BIGDATA = {
  #master_key_type = aes256-cts
  acl_file = /var/kerberos/krb5kdc/kadm5.acl
  dict_file = /usr/share/dict/words
  admin_keytab = /var/kerberos/krb5kdc/kadm5.keytab
  supported_enctypes = aes256-cts:normal aes128-cts:normal des3-hmac-sha1:normal arcfour-hmac:normal des-hmac-sha1:normal des-cbc-md5:normal des-cbc-crc:normal
  max_life = 3000d
  max_renewable_life = 3000d 0h 0m 0s
  default_principal_flags = +renewable, +forwardable
 }
4.	编辑/var/kerberos/krb5kdc/kadm5.acl文件，内容如下。
*/admin@BIGDATA	*
5.	创建数据库。
kdb5_util create -r BIGDATA -s
根据提示信息此处需要用户手工输入KDC数据库的密码，命令执行完成后，注意检查/var/kerberos/krb5kdc/下是否生成principal等票据文件。
6.	创建KDC超级管理员，根据提示信息此处需要输入管理员密码。
kadmin.local -q "addprinc admin/admin@BIGDATA"
[注意]这里KDC超级管理员的账户名为红色字体所示。
7.	分别执行如下命令启动kdc和kadmin。 
systemctl restart krb5kdc.service
systemctl restart kadmin.service
设置开机启动。
systemctl enable krb5kdc.service
systemctl enable kadmin.service


## 第四章 常见问题 FAQ

### 4.1 MySql相关

#### 4.1.1 重置root密码时，报错 Plugin 'auth_socket' is not loaded

需要将auth插件更改为

```mysql_native_password```

免密登录数据库后，运行如下命令:

	```
	use mysql;
	update user set authentication_string=PASSWORD('bigdata') where User='root';
	update user set plugin="mysql_native_password" where User='root';
	flush privileges;
	exit
	```
	
重启mysql登录即可。

#### 4.1.2 Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'

原因在于 ```/var/run``` 下面没有mysqld目录。

解决方法:

	```
	mkdir -p /var/run/mysqld
	chown mysql /var/run/mysqld/
	service mysql restart
	```

#### 4.1.3 mysql主从配置slave节点slave start报错: ERROR 1872 (HY000): Slave failed to initialize relay log info structure from the repository

由于 ```mysql.slave_relay_log_info``` 表中保留了以前的复制信息，导致新从库启动时无法找到对应文件，需要清理掉该表中的记录。

运行命令:

```slave reset;```

再重新运行change master...

```cat id_rsa.pub >> .ssh/authorized_keys```

#### 4.1.4 组件数据库配置有误

![](/pic/oozie_warning.png)

安装组件时没有配置正确的数据库（默认为 new database）。

应提前配置数据库，然后在安装组件时选择 existing MySql/MariaDB 并输入配置好的数据库信息：

![](/pic/oozie_db.png)

![](/pic/oozie_param_modified.png)

其他组件安装时也应该选择类似的数据库配置。

### 4.2 ambari-server相关

#### 4.2.1 ambari-servers 启动失败

运行 ambari-server start时报错 no valid keyboard

原因: 缺少 /var/lib/ambari-server/keys/db/newcerts

运行命令:

```mkdir -p /var/lib/ambari-server/keys/db/newcerts```

#### 4.3.2 REASON: Unable to detect a system user for Ambari Server.

运行命令:

```vi /etc/ambari-server/conf/ambari.properties```

添加内容:

```ambari-server.user=root```

### 4.3 HDFS 安装相关

#### 4.3.1 安装向导源丢失

1. 开启新的tab页刷新浏览器

2. 将源手动写入数据库

3. 重试


#### 4.3.2 HDFS NameNode启动报错: Execution of '/usr/hdp/current/hadoop-hdfs-namenode/bin/hdfs dfsadmin -fs hdfs://kylin2.bigdata.com:8020 -safemode get | grep 'Safe mode is OFF'' returned 1.

原因:

NameNode Server threads 参数值400

修改为200后正常启动。


#### 4.3.3 HDFS NameNode启动报错: Exiting with status 1: java.lang.OutOfMemoryError: unable to create new native thread

原因: cgroup 限制，需要修改系统参数。

运行命令:

```vi /etc/systemd/system.conf```

DefaultTasksMax默认值512，修改为:

	DefaultTasksMax=65535

```vi /etc/systemd/logind.conf```

UserTasksMax默认值12288，修改为:

	UserTasksMax=65535


### 4.4 其他问题 

#### 4.4.1 DNS错误:

修改host:

```vi /etc/hosts```

#### 4.4.2 报错 UnicodeDecodeError: 'ascii' codec can't decode byte 0xe6 in position 1: ordinal not in range(128)

在报错的.py文件开头添加:

	import sys
	reload(sys)
	sys.setdefaultencoding('utf-8')

#### 4.4.3 登录时不是root用户，则需要开启root：

ssh -q -l inspur -p 22 10.221.129.30

1. 初始化root密码：
sudo passwd root

2. 将PermitRootLogin项prohibit-password改为yes:
sudo vi /etc/ssh/sshd_config
PermitRootLogin=yes 

3. 重启sshd服务即可:
service sshd restart

#### 4.4.4 安装ntp时80端口被apache2占用：

journalctl -xe
netstat -anp|grep 80
systemctl status apache2
systemctl stop apache2

root@master1:~# service ntpdate stop
Failed to stop ntpdate.service: Unit ntpdate.service not loaded.
root@master1:~# service ntp stop
root@master1:~# ntpdate manager.bigdata.com
25 Nov 17:04:27 ntpdate[4930]: adjust time server 172.16.15.220 offset 0.001752 sec

#### 4.4.5 票据问题

边栏 -> Cluster Admin -> 安全认证 -> zeppelin.server.kerberos.principal参数

修改参数：

![](/pic/zeeplin_credential.jpg)

# 遇到的问题

1. 初次安装集群时，hdfs client安装失败

resource_management.core.exceptions.Fail: Applying File['/usr/hdp/current/hadoop-client/conf/hadoop-policy.xml'] failed, parent directory /usr/hdp/current/hadoop-client/conf doesn't exist

解决方法：手动创建目录 mkdir -p /usr/hdp/current/hadoop-client/conf

2. 首次安装主机出现警告

resource_management.core.exceptions.Fail: Applying File['/etc/hadoop/conf/dfs.exclude'] failed, parent directory /etc/hadoop/conf doesn't exist


手动创建文件夹 mkdir -p /etc/hadoop/conf后在主页手动启动

3. 初次安装Tez时，报错/usr/hdp/current/tez-client已存在冲突

resource_management.core.exceptions.ExecutionFailed: Execution of 'ambari-python-wrap /usr/bin/hdp-select set tez-client 3.1.0.0-78' returned 1. symlink target /usr/hdp/current/tez-client for tez already exists and it is not a symlink.

解决方法：删除/usr/hdp/current/tez-client并手动创建symbolink
[root@manager ~]# rm -rf /usr/hdp/current/tez-client
[root@manager ~]# ambari-python-wrap /usr/bin/hdp-select set tez-client 3.1.0.0-78

4. 初次安装hive时，数据库测试连接不上，之后配置可以连接，可能需要手动配置jdbc

5. 初次安装hive时，/usr/hdp/current/hive-client已存在冲突

resource_management.core.exceptions.ExecutionFailed: Execution of 'ambari-python-wrap /usr/bin/hdp-select set hive-client 3.1.0.0-78' returned 1. symlink target /usr/hdp/current/hive-client for hive already exists and it is not a symlink.

[root@manager ~]# rm -rf /usr/hdp/current/hive-client
[root@manager ~]# ambari-python-wrap /usr/bin/hdp-select set hive-client 3.1.0.0-78

6. 初次安装hive时，安装完成后启动Hive Metastore失败

数据库无法连接，需要手动执行
ambari-server setup --jdbc-db=mysql --jdbc-driver=/usr/share/java/mysql-connector-java-5.1.48.jar

之后手动启动hive服务

7. 初次安装hive，hive server2无法启动

Exception: HiveServer2 is no longer running, check the logs at /var/log/hive

[root@manager ~]# cat /var/log/hive/hive.out
Cannot find hadoop installation: $HADOOP_HOME or $HADOOP_PREFIX must be set or hadoop must be in the path

警告1 安装hbase时，参数user自动加上janusgraph，此时janusgraph还没安装

警告2 hbase报错连不上RegionServer

警告3 hbase user和superuser不一致

8. 开启安装模式时弹窗报错

500状态码 在POST方法接收API：/api/v1/stacks/HDP/versions/3.1/recommendations

错误信息: Stack Advisor reported an error. Exit Code: 2. Error: KeyError: 'hbase-env' 
StdOut file: /var/run/ambari-server/stack-recommendations/79/stackadvisor.out

StdErr file: /var/run/ambari-server/stack-recommendations/79/stackadvisor.err

9. Flink无法启动

尝试重启ambari-agent

10. 安装janusgraph出现警告 Failed connect to manager.bigdata.com:8182; Connection refused