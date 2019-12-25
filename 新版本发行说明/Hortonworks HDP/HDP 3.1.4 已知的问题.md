# 已知问题 Known Issues

此版本的已知问题摘要。

Hortonworks错误ID	|	Apache JIRA	|	Apache组件	|	摘要	|
----------	|	----------	|	----------	|	----------	|
| BUG-79238	|	不可用	|	文档，HBase，HDFS，Hive，MapReduce，Zookeeper	|	"**问题或行为的描述**

SSL已弃用，不建议在生产中使用SSL。使用TLS。

**解决方法**

在Ambari中：使用ssl.enabled.protocols = TLSv1 | TLSv1.1 | TLSv1.2和security.server.disabled.protocols = SSL | SSLv2 | SSLv3。有关为其他组件配置TLS的帮助，请联系客户支持。文档将在将来的版本中提供。 |
| BUG-106494	|	不可用	|	文档，Hive	|	"**问题描述**

当对类型为double的Hive列进行分区时，如果列值为0.0，则实际的分区目录将创建为“ 0”。发生AIOB异常。

**相关错误消息**

2018-06-28T22:43:55,498 ERROR
441773a0-851c-4b25-9e47-729183946a26 main exec.StatsTask:  Failed to run
stats task org.apache.hadoop.hive.ql.metadata.HiveException:
java.lang.IndexOutOfBoundsException:  Index: 8, Size: 8 at
org.apache.hadoop.hive.ql.metadata.Hive.setPartitionColumnStatistics(Hive.java:4395)
~hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT at
org.apache.hadoop.hive.ql.stats.ColStatsProcessor.persistColumnStats(ColStatsProcessor.java:179)
~hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT at
org.apache.hadoop.hive.ql.stats.ColStatsProcessor.process(ColStatsProcessor.java:83)
~hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT at
org.apache.hadoop.hive.ql.exec.StatsTask.execute(StatsTask.java:108)
hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT  at
org.apache.hadoop.hive.ql.exec.Task.executeTask(Task.java:205)
hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT at
org.apache.hadoop.hive.ql.exec.TaskRunner.runSequential(TaskRunner.java:97)
hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT  at
org.apache.hadoop.hive.ql.Driver.launchTask(Driver.java:2689)
hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT  at
org.apache.hadoop.hive.ql.Driver.execute(Driver.java:2341)
hive-exec-4.0.0-SNAPSHOT.jar:4.0.0-SNAPSHOT at
org.apache.hadoop.hive.ql.Driver.run

**解决方法**

不要对double类型的列进行分区。 |
| BUG-106379	|	不可用	|	文档，Hive	|	"**问题描述**

升级过程无法执行ACID表的必要压缩，并且可能导致永久性数据丢失。

**解决方法**

如果Hive Metastore中有ACID表，请在Ambari中启用ACID操作或设置Hive配置属性以启用ACID。如果禁用了ACID操作，则升级过程不会转换ACID表。这会导致数据永久丢失；您以后将无法恢复ACID表中的数据。 |
| BUG-106286	|	不可用	|	文档，Hive	|	"**问题描述**

升级过程可能无法备份Hive Metastore，这一点至关重要。

**解决方法**

升级之前，手动对Hive Metastore数据库进行手动备份。如果您不使用Ambari来安装Hive和创建元存储数据库，则进行备份尤为重要，但在所有情况下均强烈建议您进行备份。Ambari可能没有必要的权限才能自动执行备份。即使备份失败，升级也可能成功，因此拥有备份至关重要。 |
| BUG-101082	|	不可用	|	文档，Hive	|	"**问题或行为的描述**

当以批处理方式运行Beeline时，在极少数情况下，由工作负载管理过程终止的查询可能会在命令行上错误地返回成功。

**解决方法**

当前没有解决方法。**问题或行为的描述**

当以批处理方式运行Beeline时，在极少数情况下，由工作负载管理过程终止的查询可能会在命令行上错误地返回成功。

**解决方法**

当前没有解决方法。**问题或行为的描述**

当以批处理方式运行Beeline时，在极少数情况下，由工作负载管理过程终止的查询可能会在命令行上错误地返回成功。

**解决方法**

当前没有解决方法。 |
| BUG-103495	|	HBASE-20634，HBASE-20680，HBASE-20700	|	HBase	|	"**问题或行为的描述**

由于在HBase中重构了区域分配，因此存在尚不清楚的问题可能会影响此功能的稳定性。如果您依赖RegionServer Groups功能，建议您等到将来的HDP 3.x版本发布，该版本将返回该功能的稳定性，因为它在HBase 1.x / HDP 2.x版本中可用。

**解决方法**

当前没有解决方法。 |
| BUG-98727	|	不可用	|	HBase	|	"**问题或行为的描述**

由于在HBase中重构了区域分配，因此存在尚不清楚的问题可能会影响此功能的稳定性。如果依赖于区域复制功能，建议您等到将来的HDP 3.x版本发布，该版本将恢复该功能的稳定性，因为它在HBase 1.x / HDP 2.x版本中可用。

**解决方法**

当前没有解决方法。 |
BUG105983	|	不可用	|	HBase	|	"**问题或行为的描述**

HBase服务（主服务器或RegionServer）停止参与其余的HBase群集。

**相关错误消息**

服务的日志包含堆栈跟踪，其中包含“ Kerberos主体名称不具有预期的主机名部分...”

**解决方法**

重试连接即可解决问题。**问题或行为的描述**

HBase服务（主服务器或RegionServer）停止参与其余的HBase群集。

**相关错误消息**

服务的日志包含堆栈跟踪，其中包含“ Kerberos主体名称不具有预期的主机名部分...”

**解决方法**

重试连接即可解决问题。 |
| BUG-121749	|	HBASE-20662	|	HBase	|	"**问题或行为的描述**

HBase空间配额策略状态有时会自动从“禁用”更改为“观察”。

**解决方法**

通过设置LIMIT => NONE禁用表上的空间配额策略。 |
| BUG-96402	|	HIVE-18687	|	Hive	|	"**问题或行为的描述**

当HiveServer2在HDP 3.0.0中以HA（高可用性）模式运行时，所有HiveServer2实例都会在内存中加载资源计划。如果客户端对资源计划进行更改，则更改仅在与客户端连接的HiveServer2中反映（推动）。

**解决方法**

为了使资源计划更改反映在所有HiveServer2实例上，必须重新启动所有HiveServer2实例，以便它们可以从metastore重新加载资源计划。 |
| BUG-88614	|	不可用	|	Hive	|	"**问题或行为的描述**

Hive Metastore的RDMBS架构包含定义为的索引HL_TXNID_​​INDEX
CREATE INDEX HL_TXNID_INDEX ON HIVE_LOCKS USING hash (HL_TXNID);

PostgreSQL不建议使用哈希索引。有关更多信息，请参见https://www.postgresql.org/docs/9.4/static/indexes-types.html

**解决方法**

建议将此索引更改为type BTREE。 |
| BUG-60904	|	Knox823	|	Knox	|	"**问题或行为的描述**

当Apache Knox代理Ambari时，不会重写快速链接以通过网关返回。如果对Ambari的所有访问都是通过部署中的Knox进行的，则新的Ambari QuickLink配置文件可用于隐藏和/或更改URL以永久通过Knox。将来的版本将使这些内容适当地反映网关。

**解决方法**

当前没有解决方法。**问题或行为的描述**

当Apache Knox代理Ambari时，不会重写快速链接以通过网关返回。如果对Ambari的所有访问都是通过部署中的Knox进行的，则新的Ambari QuickLink配置文件可用于隐藏和/或更改URL以永久通过Knox。将来的版本将使这些内容适当地反映网关。

**解决方法**

当前没有解决方法。 |
| BUG-107399	|	不可用	|	Knox	|	"**问题或行为的描述**

从以前的HDP版本升级后，某些拓扑部署可能会返回503错误。这包括但不限于针对启用KnoxSSO的服务的knoxsso.xml。

**解决方法**

遇到这种情况时，通过Ambari（偶数空格）对knoxsso拓扑（或任何其他有此问题的拓扑）进行较小的更改并重新启动Knox网关服务器应该可以解决此问题。 |
| BUG-110463	|	Knox1434	|	Knox	|	"**问题或行为的描述**

在任何浏览器（Firefox / Chrome）中访问Knox Admin UI都会为运行Knox的主机设置HTTP严格传输安全性（HSTS）标头。由于此标头，通过HTTP对同一主机上的其他服务（例如Graphana，Ranger等）的任何后续请求都将重定向到HTTPS。

请注意，默认情况下，在所有Knox拓扑中均禁用此HSTS标头。

有关更多信息，请参阅https://knox.apache.org/books/knox-1-1-0/user-guide.html#HTTP+Strict+Transport+Security

**影响力**

对其他服务的所有非SSL请求都将自动重定向到HTTPS，并会导致SSL错误，例如：SSL_ERROR_RX_RECORD_TOO_LONG或其他错误。

**解决方法**

使用manager.xml拓扑并从WebAppSec提供程序中删除设置。您可以使用Knox管理员界面执行此操作。删除设置后，关闭浏览器或清除cookie。 |
BUG121014	|	不可用	|	Oozie	|	"**问题或行为的描述**

如果您使用的是非基于rpm的Linux发行版，例如，由于操作系统中存在不正确的Apache Tomcat服务器版本，则Debian，Ubuntu，Oozie升级后将无法启动。

**解决方法**

完成升级后，手动安装Apache Tomcat 7或更高版本。 |
| BUG-101227	|	不可用	|	Spark	|	"**问题或行为的描述**

当Spark Thriftserver必须同时运行多个查询时，在执行广播联接时，其中一些查询可能会因超时异常而失败。

**相关错误消息**

Caused by:
java.util.concurrent.TimeoutException: Futures timed out after [300 seconds]  at
                           
scala.concurrent.impl.Promise$DefaultPromise.ready(Promise.scala:219)  at
scala.concurrent.impl.Promise$DefaultPromise.result(Promise.scala:223) at 
scala.concurrent.Await$$anonfun$result$1.apply(package.scala:107)  at
scala.concurrent.BlockContext$DefaultBlockContext$.blockOn(BlockContext.scala:53) at 
scala.concurrent.Await$.result(package.scala:107)  at
org.apache.spark.sql.execution.joins.BroadcastHashJoin.doExecute(BroadcastHashJoin.scala:107)
                           

**解决方法**

您可以通过增加spark.sql.broadcastTimeout值来解决此问题。 |
BUG109979	|	不可用	|	Spark	|	"x

由于YarnShuffleService CNF，在Spark补丁升级后，YARN NodeManager无法启动。

**解决方法**

要解决此问题，您必须：

在“ yarn.nodemanager.aux-services.spark2_shuffle.classpath”属性值中，将“ {{spark2_version}}”替换为“ $ {hdp.version}”。例如，旧值“ {{stack_root}} / {{spark2_version}} / spark2 / aux / *”->新值“ {{stack_root}} / $ {hdp.version} / spark2 / aux / *” |
BUG65977	|	SPARK-14922	|	Spark	|	"**问题或行为的描述**

从Spark 2.0.0开始，语法不支持`DROP PARTITION BY RANGE`。换句话说，仅支持'='，而不支持'<'，'>'，'<='，'> ='。

**相关错误消息**
scala> sql(""alter table t drop partition (b<1) "").show
org.apache.spark.sql.catalyst.parser.ParseException:
mismatched input '<' expecting {')', ','}(line 1, pos 31)

== SQL ==
alter table t drop partition (b<1)
-------------------------------^^^

**解决方法**

要删除分区，请使用完全匹配的'='。
scala> sql(""alter table t drop partition (b=0) "").show |
BUG114383	|	不可用	|	STORM	|	"**问题或行为的描述**

向Storm提交拓扑失败。将拓扑提交给Storm时，您会看到一个错误。

**相关错误消息**

使用堆栈跟踪org.apache.storm.hack提交拓扑时，将显示以下错误消息：

Exception in thread ""main"" java.lang.IllegalArgumentException
    at org.apache.storm.hack.shade.org.objectweb.asm.ClassReader.<init>(Unknown Source)
    at org.apache.storm.hack.shade.org.objectweb.asm.ClassReader.<init>(Unknown Source)
    at org.apache.storm.hack.shade.org.objectweb.asm.ClassReader.<init>(Unknown Source)

**解决方法**

使用Ambari用户界面查找Storm配置中是否存在“ client.jartransformer.class”。如果存在该配置，请设置为“”，然后重新启动Storm服务以使其生效。


您必须提供的值是一个空格，Ambari限制配置为具有一个值，但不允许多个空格。
 |
| BUG-106917	|	不可用	|	Sqoop	|	"**问题或行为的描述**

在HDP 3中，托管Hive表必须是事务性（hive.strict.managed.tables=true）。Hive不支持Parquet格式的事务表。指定为的Hive导入 --as-parquetfile必须使用外部表 --external-table-dir。

**相关错误消息**
Table db.table failed strict managed table checks due to the
following reason: Table is marked as a managed table but is not
transactional. 

**解决方法**

使用--hive-importwith时--as-parquetfile，用户还必须提供 表--external-table-dir的完全限定位置：
sqoop import ... --hive-import
                 --as-parquetfile 
                 --external-table-dir hdfs:///path/to/table |
| BUG-102672	|	不可用	|	Sqoop	|	"**问题或行为的描述**

在HDP 3中，托管Hive表必须是事务性的（hive.strict.managed.tables = true）。Hive不支持使用HCatalog编写事务表。如果指定的Hive表不存在或不在外部，则在HCatalog Sqoop导入期间会导致错误。

**相关错误消息**
不支持从Pig / Mapreduce存储到事务表db.table中

**解决方法**

在使用Sqoop运行HCatalog导入之前，用户必须在Hive中创建外部表。--create-hcatalog-table不支持创建外部表。 |
| BUG-109607	|	不可用	|	YARN	|	"**问题或行为的描述**

通过在Docker上使用YARN上的容器化Spark启用有线加密，Spark提交在“集群”部署模式下失败。“客户端”部署模式下的Spark提交工作成功。

**相关错误消息**
不支持从Pig / Mapreduce存储到事务表db.table中。

**解决方法**

当前没有解决方法。 |
| BUG-110192	|	不可用	|	YARN	|	"**问题或行为的描述**

当仅使用KNOX SSO安装并配置YARN时，Application Timeline Server Web端点将阻止来自YARN UI的远程REST调用，并显示401未经授权错误。

**相关错误消息**
401未经授权的错误。

**解决方法**

管理员需要为Timeline Server和现有的hadoop级别配置配置Knox身份验证处理程序。

管理员需要调整以下群集特定的配置。最后两个属性的值在hadoop.authentication。*属性文件中。
<property>
<name>yarn.timeline-service.http-authentication.type</name>
<value>org.apache.hadoop.security.authentication.server.JWTRedirectAuthenticationHandler</value>
</property>

<property>
<name>yarn.timeline-service.http-authentication.authentication.provider.url</name>
<value>https://ctr-e138-1518143905142-455650-01-000002.hwx.site:444/gateway/knoxsso/api/v1/websso</value>
</property>

<property>
<name>yarn.timeline-service.http-authentication.public.key.pem</name>
<value>public.key.pem</value>
</property>**问题或行为的描述**

当仅使用KNOX SSO安装并配置YARN时，Application Timeline Server Web端点将阻止来自YARN UI的远程REST调用，并显示401未经授权错误。

**相关错误消息**
401未经授权的错误。

**解决方法**

管理员需要为Timeline Server和现有的hadoop级别配置配置Knox身份验证处理程序。

管理员需要调整以下群集特定的配置。最后两个属性的值在hadoop.authentication。*属性文件中。
<property>
<name>yarn.timeline-service.http-authentication.type</name>
<value>org.apache.hadoop.security.authentication.server.JWTRedirectAuthenticationHandler</value>
</property>

<property>
<name>yarn.timeline-service.http-authentication.authentication.provider.url</name>
<value>https://ctr-e138-1518143905142-455650-01-000002.hwx.site:444/gateway/knoxsso/api/v1/websso</value>
</property>

<property>
<name>yarn.timeline-service.http-authentication.public.key.pem</name>
<value>public.key.pem</value>
</property> |
RMP-11408	|	ZEPPELIN-2170	|	Zeppelin	|	"**问题或行为的描述**

Zeppelin不会在Zeppelin的笔记本电脑级别上显示Spark-Shell抛出的所有WARN消息。

**解决方法**

当前没有解决方法。 |