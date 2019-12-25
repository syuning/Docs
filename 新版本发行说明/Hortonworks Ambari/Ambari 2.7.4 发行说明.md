
> 源文档地址：https://docs.cloudera.com/HDPDocuments/Ambari-2.7.4.0/ambari-release-notes/content/ambari_relnotes.html

# **Ambari 2.7.4 发行说明**

本文档为您提供有关Apache Ambari 2.7.4发行版的最新信息。

## **新功能描述**

以下是Ambari 2.7.4版本中引入的新功能。


*表1. Apache Ambari 2.7.4的新功能*
特征 | 描述
---- | ----
Ambari用户的密码策略 | 此版本的Ambari支持一项功能，使您可以为Ambari用户配置密码策略。

## **行为更改**
行为更改表示从先前发布的版本到此版本的Ambari，其行为已发生明显变化。与先前发布的版本相比，此版本没有任何行为更改。

*表1. Apache Ambari 2.7.4行为更改*
Hortonworks BUG ID | Apache组件 | Apache JIRA | 摘要 | 细节
-------------------- | -------------------- | -------------------- | -------------------- | --------------------
BUG-105818 | Ambari | AMBARI-9016 | 内容为JSON时，Ambari API使用HTTP标头Content-Type：text / plain | **场景**：<br>即使内容为JSON格式，Ambari REST API仍希望将“ Content-Type” HTTP标头设置为“ text / plain”。如果客户端使用“ application / json”值指定了相同的标头，则Ambari会引发HTTP 500错误。<br><br>**先前的行为**： <br>Ambari的行为具有误导性，迫使用户在HTTP客户端中使用“文本/纯文本” Content-Type标头。<br><br>**新行为**：<br>Ambari需要“ application / json” Content-Type标头。<br><br>**预期的客户操作**：<br>修改任何使用Ambari REST API的自定义代码，并在需要时采取措施

## **常见漏洞**
没有常见漏洞（CVE）修复程序适用于Ambari 2.7.4。

## **已修复的问题**
已修复的问题表示以前通过Hortonworks支持部门记录的某些选定问题，但在当前版本中已得到解决。这些问题可能已经在以前版本的“已知问题”部分中报告过；表示它们由客户报告或由Hortonworks质量工程团队识别。

### 结果不正确
错误编号 | Apache JIRA | 摘要
---------- | ---------- | ----------
错误120097 | [AMBARI-25278](https://issues.apache.org/jira/browse/AMBARI-25278) | 在Kafka的Grafana仪表板中修复汇总指标
BUG-100002 | [AMBARI-23478](https://issues.apache.org/jira/browse/AMBARI-23478) | YARN群集CPU使用率图始终显示高CPU使用率

### 其他				
BUG-编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
BUG-120711	|	[AMBARI-25320](https://issues.apache.org/jira/browse/AMBARI-25320)	|	NIFI-Hosts仪表板在Grafana中未显示任何指标
BUG-120503	|	[AMBARI-25293](https://issues.apache.org/jira/browse/AMBARI-25293)	|	LogSearch：更新检查点时，logfeeder引发NPE
BUG-120353	|	[AMBARI-25305](https://issues.apache.org/jira/browse/AMBARI-25305)	|	安装群集后，Ambari UI进入损坏状态
BUG-120078	|	[AMBARI-25275](https://issues.apache.org/jira/browse/AMBARI-25275)	|	YARN线容量计划程序中的更改请求重新启动资源管理器
BUG-119973	|	[AMBARI-24950](https://issues.apache.org/jira/browse/AMBARI-24950)	|	Logsearch：在Logfeeder中使用os时区
BUG-119367	|	[Ambari-25234](https://issues.apache.org/jira/browse/Ambari-25234)	|	以管理员身份执行API调用时，Ambari审核日志显示“空”用户
BUG-119103	|	[AMBARI-25093](https://issues.apache.org/jira/browse/AMBARI-25093)	|	Spark2 Thrift Server警报不适用于HTTPS / SSL
BUG-118993	|	[AMBARI-25210](https://issues.apache.org/jira/browse/AMBARI-25210)	|	通过蓝图安装ONEFS失败
BUG-118727	|	[AMBARI-25196](https://issues.apache.org/jira/browse/AMBARI-25196)	|	HDFS服务在Ambari WFManager视图中检查ClassNotFound错误
BUG-118660	|	[AMBARI-25080](https://issues.apache.org/jira/browse/AMBARI-25080)<br>[AMBARI-25088](https://issues.apache.org/jira/browse/AMBARI-25088)	|	CLONE-无法安装Hive服务
BUG-118561	|	[AMBARI-25187](https://issues.apache.org/jira/browse/AMBARI-25187)	|	不需要时，Kerberos操作显示在服务操作下拉列表中
BUG-118559	|	[AMBARI-25186](https://issues.apache.org/jira/browse/AMBARI-25186)	|	当kerberos-env / kdc-type为none时，不需要通过蓝图安装Kerberos Client
BUG-117935	|	[AMBARI-25165](https://issues.apache.org/jira/browse/AMBARI-25165)	|	Oozie服务检查由于导入错误而失败
BUG-117930	|	[AMBARI-25164](https://issues.apache.org/jira/browse/AMBARI-25164)	|	机架“配置刷新”行为在Ambari 2.6和2.7.3中有所不同
BUG-117882	|	[AMBARI-25159](https://issues.apache.org/jira/browse/AMBARI-25159)	|	http.strict-transport-security更改在2.7.x中不生效
BUG-117868	|	[AMBARI-25158](https://issues.apache.org/jira/browse/AMBARI-25158)	|	仪表板无法加载。常见的控制台错误：“严重TypeError：未定义widgetGroups”
BUG-117414	|	[AMBARI-25168](https://issues.apache.org/jira/browse/AMBARI-25168)	|	主题负责人被分配为“无”
BUG-117246	|	[AMBARI-25151](https://issues.apache.org/jira/browse/AMBARI-25151)	|	当SystemD启动代理时，以root用户运行的HDFS在SLES 12.2中的进程限制为512
BUG-116898	|	[AMBARI-25114](https://issues.apache.org/jira/browse/AMBARI-25114)	|	如果将Ambari Server配置为https，则无法登录到Logsearch UI
BUG-116328	|	[AMBARI-25069](https://issues.apache.org/jira/browse/AMBARI-25069)	|	使用本地存储库导致堆栈安装失败时，将空的baseurl值写入回购文件
BUG-116216	|	[AMBARI-25052](https://issues.apache.org/jira/browse/AMBARI-25052)	|	由于toMapByProperty（），无法添加服务
BUG-113969	|	[AMBARI-25102](https://issues.apache.org/jira/browse/AMBARI-25102)	|	Dasboard指标不会为用户名中包含点的ambari用户加载。
BUG-113526	|	[AMBARI-24848](https://issues.apache.org/jira/browse/AMBARI-24848)<br>[AMBARI-25096](https://issues.apache.org/jira/browse/AMBARI-25096)	|	卫星回购群集安装问题
BUG-112761	|	[AMBARI-24767](https://issues.apache.org/jira/browse/AMBARI-24767)	|	CLONE-移动操作期间启动Timeline v2 Reader时出错
BUG-111201	|	[AMBARI-24652](https://issues.apache.org/jira/browse/AMBARI-24652)	|	Grafana无法显示自定义指标的数据
BUG-105818	|	[AMBARI-9016](https://issues.apache.org/jira/browse/AMBARI-9016)	|	当内容为JSON时，Ambari API使用HTTP标头Content-Type：text / plain。
BUG-120905	|	[AMBARI-25328](https://issues.apache.org/jira/browse/AMBARI-25328)	|	当spark_transport_mode设置为'http'时，STS服务器将无法在Ambari 2.7中启动。
				
### 性能				
BUG-编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
BUG-119395	|	[AMBARI-25235](https://issues.apache.org/jira/browse/AMBARI-25235)	|	添加sysprep配置以仅一次运行配置选择
				
### 安全				
BUG-编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
BUG-120219	|	[AMBARI-25280](https://issues.apache.org/jira/browse/AMBARI-25280)	|	添加不存在的LDAP用户时的错误处理错误
BUG-120086	|	[AMBARI-25277](https://issues.apache.org/jira/browse/AMBARI-25277)	|	涉及ambari-server.log和ambari-agent.log的安全性问题显示明文密码。
BUG-118907	|	[AMBARI-25204](https://issues.apache.org/jira/browse/AMBARI-25204)	|	检索错误不存在的Ambari View资源的详细信息时，Ambari在HTML doc中返回堆栈跟踪
BUG-118849	|	[AMBARI-25201](https://issues.apache.org/jira/browse/AMBARI-25201)	|	更新用户密码不会验证管理员的当前密码。
BUG-118750	|	[AMBARI-25200](https://issues.apache.org/jira/browse/AMBARI-25200)	|	检索错误不存在的用户资源的详细信息时，Ambari在HTML doc中返回堆栈跟踪
BUG-118562	|	[AMBARI-25283](https://issues.apache.org/jira/browse/AMBARI-25283)	|	添加主机，添加远程集群以及重命名集群时，Ambari UI会评估嵌入在用户输入中的Javascript
BUG-117996	|	[AMBARI-25169](https://issues.apache.org/jira/browse/AMBARI-25169)	|	在Ambari中将Apache Solr版本升级到7.7.0或更高版本
BUG-116897	|	[AMBARI-25141](https://issues.apache.org/jira/browse/AMBARI-25141)	|	加密密码后，ldap-password.dat文件中的明文形式的LDAP密码
				
### 稳定性				
BUG-编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
BUG-119942	|	[AMBARI-25272](https://issues.apache.org/jira/browse/AMBARI-25272)	|	Ambari UI默认Ajax超时为3分钟，但是服务器中的某些操作可能会花费更多时间
BUG-118554	|	[AMBARI-25185](https://issues.apache.org/jira/browse/AMBARI-25185)	|	Chrome和Firefox浏览器在打开Ambari UI时崩溃
BUG-116973	|	[AMBARI-25123](https://issues.apache.org/jira/browse/AMBARI-25123)	|	/ var / lib / ambari-agent / cache不更新（Ambari 2.7）
				
### 可支持性				
BUG-编号	|	Apache JIRA	|	摘要
----------	|	----------	|	----------
BUG-119871	|	[AMBARI-25269](https://issues.apache.org/jira/browse/AMBARI-25269)	|	HA设置中触发的Hive Server Interactive进程警报
				
### 易用性				
BUG-编号	|	Apache JIRA		| 摘要
----------	|	----------	|	----------
BUG-120730	|	[AMBARI-25311](https://issues.apache.org/jira/browse/AMBARI-25311)	|	FinalizeKerberosServerAction超时必须是可配置的
BUG-116406	|	[AMBARI-25090](https://issues.apache.org/jira/browse/AMBARI-25090)	|	Logsearch应该索引没有结尾句点（。）的关键字
BUG-113845	|	[AMBARI-24879](https://issues.apache.org/jira/browse/AMBARI-24879)	|	对于MIT KDC交互，应该可以配置kadmin服务主体名称
BUG-113488	|	[AMBARI-24847](https://issues.apache.org/jira/browse/AMBARI-24847)	|	[Logsearch后端]我无法搜索包含空格或破折号的术语

## **已知问题**
Ambari 2.7.4具有以下已知问题，计划在将来的版本中解决。

Apache JIRA	|	Hortonworks错误ID	|	问题	|	解决方法
----------	|	----------	|	----------	|	----------
不可用	|	BUG-120773	|	EU：Oozie SC失败java.io.IOException：连接Oozie服务器时出错	|	如果配置了Ranger HA和/或Oozie Server HA，并且正在使用自定义复合密钥表文件，则在HDP 2.6到HDP 3.1升级期间，对Ranger和Oozie的服务检查将失败。<br>重新创建自定义的Ranger和/或Oozie Server密钥表文件，然后重试服务检查，或者忽略并继续进行服务检查。
不可用	|	BUG-121044	|	禁用kerberos后，STORM服务检查失败	|	我们应该创建ZooKeeper超级用户并删除/更改凭据znode的权限。详细步骤如下：<br>使用ZooKeeper客户端登录到任何节点，并为所选用户创建摘要：密码对：<br>brexport ZK_CLASSPATH=/etc/zookeeper/conf/:/usr/hdp/current/zookeeper-server/lib/*:/usr/hdp/current/zookeeper-server/* <br>java -cp $ZK_CLASSPATH org.apache.zookeeper.server.brauth.DigestAuthenticationProvider super:super123<br>其中super：super123是user：password对。我们将在输出中得到摘要：<br>super:super123->super:UdxDQl4f9v5oITwcAsO9bmWgHSI=<br>通过添加以下行来更新ZooKeeper服务页面上的“ zookeeper-env模板”属性：<br>export SERVER_JVMFLAGS="$SERVER_JVMFLAGS -Dzookeeper.<br>DigestAuthenticationProvider.superDigest=super:UdxDQl4f9v5oITwcAsO9bmWgHSI="<br>用户应在上一步中用一个替换建议的摘要。<br>重新启动所有必需的服务。<br>使用ZooKeeper客户端登录到任何节点并连接到ZooKeeper控制台：<br>/usr/hdp/current/zookeeper-client/bin/zkCli.sh -server <zookeeperServerHostFQDN>:2181br删除/更改凭据 znode的权限。用户应使用Storm的storm.zookeeper.root属性的值 代替<stormRoot>：brdelete /<stormRoot>/credentialsbr或将权限更新为所有人可用：brsetAcl /<stormRoot>/credentials world:anyone:cdrwabr完成上述步骤后，Storm服务检查将开始通过。
不可用	|	BUG-120925	|	升级到Ambari 2.7.4.0后，Hbase服务检查失败	|	确保HDFS服务已完全启动，然后重新启动HBase服务。
不可用	|	BUG-113993	|	记录有关在AMS中禁用安全性的已知问题。在过去已启用安全性的群集上，如果已禁用安全性，那么度量收集器启动将失败并显示错误。	|	清除ams-hbase-site：zookeeper.znode.parent中指定的znode上的数据。br如果AMS处于嵌入式模式，则可以通过删除ams-hbase-site属性“ HBase ZooKeeper属性DataDir”中指定的目录来完成此操作。br如果AMS处于分布式模式，则可以通过使用zkCli在群集Zookeeper中删除znode来完成。br将znode的值从/ ams-hbase-unsecure更改为/ ams-hbase-unsecure-new也可以，而不是删除znode，也可以。
不可用	|	BUG-121151	|	在安装了openssl 1.1.0k的Debian 9上从Ambari 2.7.1（或更旧版本）升级到2.7.4时，Smartsense服务无法启动。	|	禁用启动SmartSense服务预升级。只有成功升级到Ambari 2.7.4.0后，才能启动SmartSense服务。
不可用	|	BUG-105092	|	EU期间高可用性群集上的Oozie服务检查失败	|	如果配置了Ranger HA和/或Oozie Server HA，并且正在使用自定义复合密钥表文件，则在HDP 2.6到HDP 3.0升级期间，Ranger和Oozie的服务检查将失败。

## **文档勘误表**
本节包含对产品文档的最新添加或更正。

## **法律信息**
