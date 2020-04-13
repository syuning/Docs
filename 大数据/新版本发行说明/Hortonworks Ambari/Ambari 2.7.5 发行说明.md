
> 源文档地址：https://docs.cloudera.com/HDPDocuments/Ambari-2.7.5.0/ambari-release-notes/content/ambari_relnotes.html

# Apache Ambari 2.7.5 发行说明

本文档为您提供有关Apache Ambari 2.7.5发行版的最新信息。

## 新功能描述
以下是Ambari 2.7.5版本中引入的新功能。

*表1. Apache Ambari 2.7.5的新功能*

特征 | 描述
------ | ------
安全的Ambari存储库 | 出于生产目的访问Ambari存储库需要进行身份验证。发行包存储库使用基本身份验证进行保护，并且Ambari支持处理这些存储库的用户名和密码。有关更多信息，请参阅Ambari安装指南中的“访问Ambari存储库”主题。

## 行为更改
行为更改表示从先前发布的版本到此版本的Ambari，其行为已发生明显变化。与先前发布的版本相比，此版本没有任何行为更改。

## 常见漏洞和披露
没有常见漏洞和披露（CVE）修复程序适用于Ambari 2.7.5。

## 已修复的问题
已修复的问题表示以前通过Cloudera支持记录的某些选定问题，但当前版本中已解决。这些问题可能已经在以前版本的“已知问题”部分中报告过；表示它们由客户报告或由Hortonworks质量工程团队识别。

### 结果不正确				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-121927	|	不适用	|	使用自定义队列配置YARN会导致Stack Advisor中的误导性错误
| BUG-107724	|	[AMBARI-24302](https://issues.apache.org/jira/browse/AMBARI-24302)	|	（针对2.6.x的JIRA跟踪）- Dhdp.version在Datanodes的进程输出中显示空白值
				
### 其他				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-122369	|	[AMBARI-25412](https://issues.apache.org/jira/browse/AMBARI-25412)	|	从ambari-contrib中的记录器服务方法中删除所有标签
| BUG-122337	|	不适用	|	在Zeppelin JDBC解释器中错误配置了HiveServer2 JDBC URL
| BUG-122165	|	[AMBARI-25400](https://issues.apache.org/jira/browse/AMBARI-25400)	|	HA时确定实时收集器时出现问题
| BUG-122125	|	[AMBARI-14526](https://issues.apache.org/jira/browse/AMBARI-14526)	|	Ambari代理SUSE12 Systemd服务在系统重新引导时不会自动启动Ambari代理。
| BUG-122035	|	[AMBARI-25394](https://issues.apache.org/jira/browse/AMBARI-25394)	|	HBase表的*通配符上的Ambari Metrics白名单失败
| BUG-122032	|	[AMBARI-25397](https://issues.apache.org/jira/browse/AMBARI-25397)	|	将ambari-logsearch-logfeeder升级到2.7.4 rpm会发出警告
| BUG-121976	|	[AMBARI-25378](https://issues.apache.org/jira/browse/AMBARI-25378)	|	500顾问程序错误，将ambari指标模式设置为与OneFS一起分发
| BUG-121926	|	不适用	|	从Hive脚本中删除硬编码的重试次数
| BUG-121911	|	[AMBARI-25379](https://issues.apache.org/jira/browse/AMBARI-25379)	|	将AMS Grafana版本升级到6.4.2
| BUG-121898	|	[AMBARI-25399](https://issues.apache.org/jira/browse/AMBARI-25399)	|	添加Hive PAM支持以进行服务检查和警报
| BUG-121879	|	不适用	|	oozie.server.authentication.type=kerberos启用KnoxSSO时，HDP堆栈未设置， 导致冲突
| BUG-121218	|	不适用	|	使用hdfs资源，而不是在 hive_server_interactive.py
| BUG-121024	|	[AMBARI-25333](https://issues.apache.org/jira/browse/AMBARI-25333)	|	如果高速缓存中不存在文件，则重新生成密钥表将生成空的密钥表文件
| BUG-120861	|	[AMBARI-25326](https://issues.apache.org/jira/browse/AMBARI-25326)	|	AMS-使用2个收集器时，没有HBase和Hive指标在升级后
| BUG-120603	|	[AMBARI-25395](https://issues.apache.org/jira/browse/AMBARI-25395)	|	更新Hive安装中的帮助文本以反映实际的JAR文件名或提供格式清晰的示例
				
### 性能				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-121889	|	[AMBARI-25385](https://issues.apache.org/jira/browse/AMBARI-25385)	|	减少集群创建请求的处理时间
| BUG-120989	|	[AMBARI-25332](https://issues.apache.org/jira/browse/AMBARI-25332)	|	Kerberos keytab再生工作缓慢
| BUG-122244	|	[AMBARI-21935](https://issues.apache.org/jira/browse/AMBARI-21935)	|	Hive向量化：向量化UDF会降低性能
| BUG-122079	|	[AMBARI-25156](https://issues.apache.org/jira/browse/AMBARI-25156)	|	ClientComponentHasNoStatus 异常混乱的操作系统 /var/log/messages
| BUG-122239	|	[AMBARI-25408](https://issues.apache.org/jira/browse/AMBARI-25408)	|	将Infra Solr升级到7.7.2
				
### 安全				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-121464	|	[AMBARI-25396](https://issues.apache.org/jira/browse/AMBARI-25396)	|	Ambari主机上的跨站点脚本漏洞
| BUG-122087	|	不适用	|	使用API​​将XSS漏洞存储在rack_info中
| BUG-121361	|	[AMBARI-25384](https://issues.apache.org/jira/browse/AMBARI-25384)	|	文件视图中的跨站点脚本漏洞
| BUG-122015	|	[AMBARI-25391](https://issues.apache.org/jira/browse/AMBARI-25391)	|	Ambari在ActionQueue.py中记录Grafana密码
| BUG-121801	|	[AMBARI-25390](https://issues.apache.org/jira/browse/AMBARI-25390)	|	在/ resources端点和子目录中禁用索引
				
### 稳定性				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-122238	|	[AMBARI-25403](https://issues.apache.org/jira/browse/AMBARI-25403)	|	Ambari管理包：Ambari在下载OneFS客户端配置时抛出500错误
				
### 可支持性				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-121600	|	不适用	|	对于HDP 3.1 HS（容器模式）hive.merge.nway.joins 未设置为false
				
### 易用性				
错误编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
| BUG-121804	|	[AMBARI-25380](https://issues.apache.org/jira/browse/AMBARI-25380)	|	UI无法反映/更新任务日志

## 已知问题

Ambari 2.7.5具有以下已知问题，计划在将来的版本中解决。

| Apache JIRA	|	Cloudera BUG-ID	|	问题	|	解决方法
| --------	|	--------	|	--------	|	--------
| 不适用	|	| BUG-120773	|	EU：Oozie SC失败java.io.IOException：连接Oozie服务器时出错	|	如果配置了Ranger HA和/或Oozie Server HA，并且正在使用自定义复合密钥表文件，则在HDP 2.6到HDP 3.1升级期间，对Ranger和Oozie的服务检查将失败。
|    |   -	|	-	|	-	|	重新创建自定义的Ranger和/或Oozie Server密钥表文件，然后重试服务检查，或者忽略并继续进行服务检查。
|    不适用	|	| BUG-121044	|	禁用kerberos后，STORM服务检查失败	|	我们应该创建ZooKeeper超级用户并删除/更改凭据znode的权限。详细步骤如下：
|    |   -	|	-	|	-	|	使用ZooKeeper客户端登录到任何节点，并为所选用户创建摘要：密码对：
|    |   -	|	-	|	-	|	export ZK_CLASSPATH=/etc/zookeeper/conf/:/usr/hdp/current/zookeeper-server/lib/*:/usr/hdp/current/zookeeper-server/* 
|    |   -	|	-	|	-	|	java -cp $ZK_CLASSPATH org.apache.zookeeper.server.
|    |   -	|	-	|	-	|	auth.DigestAuthenticationProvider super:super123
|    |   -	|	-	|	-	|	其中super：super123是user：password对。我们将在输出中得到摘要：
|    |   -	|	-	|	-	|	super:super123->super:UdxDQl4f9v5oITwcAsO9bmWgHSI=
|    |   -	|	-	|	-	|	通过添加以下行来更新ZooKeeper服务页面上的“ zookeeper-env模板”属性：
|    |   -	|	-	|	-	|	export SERVER_JVMFLAGS="$SERVER_JVMFLAGS -Dzookeeper.
|    |   -	|	-	|	-	|	DigestAuthenticationProvider.superDigest=super:UdxDQl4f9v5oITwcAsO9bmWgHSI="
|    |   -	|	-	|	-	|	用户应在上一步中用一个替换建议的摘要。
|    |   -	|	-	|	-	|	重新启动所有必需的服务。
|    |   -	|	-	|	-	|	使用ZooKeeper客户端登录到任何节点并连接到ZooKeeper控制台：
|    |   -	|	-	|	-	|	/usr/hdp/current/zookeeper-client/bin/zkCli.sh -server <zookeeperServerHostFQDN>:2181
|    |   -	|	-	|	-	|	删除/更改凭据 znode的权限。用户应使用Storm的storm.zookeeper.root属性的值 代替<stormRoot>：
|    |   -	|	-	|	-	|	delete /<stormRoot>/credentials
|    |   -	|	-	|	-	|	或将权限更新为所有人可用：
|    |   -	|	-	|	-	|	setAcl /<stormRoot>/credentials world:anyone:cdrwa
|    |   -	|	-	|	-	|	完成上述步骤后，Storm服务检查将开始通过。
|    不适用	|	| BUG-120925	|	升级到Ambari 2.7.5.0后，Hbase服务检查失败	|	确保HDFS服务已完全启动，然后重新启动HBase服务。
|    不适用	|	| BUG-105092	|	EU期间高可用性群集上的Oozie服务检查失败	|	如果配置了Ranger HA和/或Oozie Server HA，并且正在使用自定义复合密钥表文件，则在HDP 2.6到HDP 3.0升级期间，Ranger和Oozie的服务检查将失败。
|    不适用	|	| BUG-113993	|	在过去已启用安全性的群集上，如果已禁用安全性，那么度量收集器启动将失败并显示错误。	|	清除ams-hbase-site：zookeeper.znode.parent中指定的znode上的数据。
|    |   -	|	-	|	-	|	如果AMS处于嵌入式模式，则可以通过删除ams-hbase-site属性“ HBase ZooKeeper属性DataDir”中指定的目录来完成此操作。
|    |   -	|	-	|	-	|	如果AMS处于分布式模式，则可以通过使用zkCli在群集Zookeeper中删除znode来完成。
|    |   -	|	-	|	-	|	将znode的值从/ ams-hbase-unsecure更改为/ ams-hbase-unsecure-new也可以，而不是删除znode，也可以。
|    不适用	|	| BUG-121151	|	在安装了openssl 1.1.0k的Debian 9上从Ambari 2.7.1（或更旧版本）升级到2.7.4时，Smartsense服务无法启动。	|	禁用启动SmartSense服务预升级。只有成功升级到Ambari 2.7.4.0后，才能启动SmartSense服务。
|    不适用	|	| BUG-113753	|	在启用viewfs的集群上进行任何配置更改后，重新启动时，YARN应用程序时间轴服务器（ATSV2）失败。	|	如果重新启动HDFS，请重新启动Timeline Service V2.0 Reader。
|    不适用	|	| BUG-122551	|	提交storm-starter-topologies*.jar脚本可能会失败，因为Storm Starter脚本会尝试根据client.jartransformer.class 配置参数转换JAR 。入门脚本无法按预期处理故障。	|	转换失败时， client.jartransformer.class必须更改配置参数或将其设置为空。
|    不适用	|	| BUG-122408	|	在未完成从HDP-3.0.1.0到HDP-3.1.5.0的最终升级后，Oozie被降级。降级成功完成，但是Oozie在降级后降级了。	|	不适用
|    不适用	|	| BUG-122579	|	禁用HSI并启用HSI失败。	|	使用以下步骤启用HIS：
|    |   -	|	-	|	-	|	苏hdfs。
|    -	|	-	|	使用Hive Configs- > Enable Interactive Query在任何主机上启用HSI ，HSI已安装并启动。使用陈旧的配置重新启动服务。	|	使用hdfs主体进行身份验证： kinit -k -t /etc/security/keytabs/hdfs.headless.keytab hdfs@EXAMPLE.COM
|    |   -	|	-	|	-	|	从HDFS删除密钥标签： hdfs dfs -rm /user/hive/.yarn/keytabs/hive/hive.service.keytab
|    -	|	-	|	接下来，通过切换“ 交互查询”按钮来禁用HSI 。在另一台主机上启用HSI。	|	重新启动Hive。
|    -	|	-	|	HSI无法启动。	|	-

## 文档勘误表
本节包含对产品文档的最新添加或更正。

## 法律信息
