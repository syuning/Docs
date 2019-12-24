# **已解决的问题**

已解决的问题代表以前通过Cloudera支持记录的部分问题，但当前版本中已解决。这些问题可能已经在以前版本的“已知问题”部分中报告过；表示它们由客户报告或由Cloudera质量工程团队识别。

## **造成结果不正确的问题**

错误编号	|	Apache Jira	|	Apache 组件	|	摘要	|
----------	|	----------	|	----------	|	----------	|
BUG-120118	|	[CALCITE-2929](https://issues.apache.org/jira/browse/CALCITE-2929)	|	Calcite	|	假设可以使用CAST，则错误地简化了IS NULL检查	|
BUG-121707	|	[HDFS-14499](https://issues.apache.org/jira/browse/HDFS-14499)	|	HDFS	|	为目录启用了快照和垃圾桶功能的REM_QUOTA值具有误导性	|
BUG-122333	|	[HIVE-22476](https://issues.apache.org/jira/browse/HIVE-22476)	|	Hive	|	当hive.fetch.task.conversion设置为none时，Hive datediff函数提供的结果不一致	|
BUG-122230	|	[HIVE-22331](https://issues.apache.org/jira/browse/HIVE-22331)	|	Hive	|	不带参数的unix_timestamp返回以毫秒为单位的时间戳，而不是秒。	|
BUG-122127	|	[HIVE-22360](https://issues.apache.org/jira/browse/HIVE-22360)	|	Hive	|	当加载的文件比表模式中的列多时，MultiDelimitSerDe在最后一列中返回错误结果	|
BUG-122078	|	[HIVE-21924](https://issues.apache.org/jira/browse/HIVE-21924)	|	Hive	|	拆分文本文件，即使存在页眉/页脚	|
BUG-121958	|	[HIVE-21915](https://issues.apache.org/jira/browse/HIVE-21915)	|	Hive	|	配置为TEZ UNION ALL和UDTF的Hive导致数据丢失	|
BUG-121917	|	[HIVE-22170](https://issues.apache.org/jira/browse/HIVE-22170)	|	Hive	|	from_unixtime和unix_timestamp应该使用用户会话时区	|
BUG-121761	|	[HIVE-22107](https://issues.apache.org/jira/browse/HIVE-22107)	|	Hive	|	关联子查询产生错误的架构	|
BUG-121748	|	[HIVE-22099](https://issues.apache.org/jira/browse/HIVE-22099)	|	Hive	|	自HIVE-20007起，一些与日期相关的UDF无法正确处理儒略日期	|
BUG-121669	|	[HIVE-22121](https://issues.apache.org/jira/browse/HIVE-22121)	|	Hive	|	开启hive.tez.bucket.pruning会产生错误的结果	|
BUG-121634	|	[HIVE-22120](https://issues.apache.org/jira/browse/HIVE-22120)	|	Hive	|	修复特定边界条件下左外图连接中错误的result / ArrayOutOfBound异常	|
BUG-121905	|	不可用	|	HWC	|	HWC：为多个查询共享父数据帧会导致Spark v2.3.x中出现问题-无需进行OR过滤器	|
BUG-122387	|	[ZEPPELIN-3701](https://issues.apache.org/jira/browse/ZEPPELIN-3701)	|	Zeppelin	|	在结果表中缺少前几个“ 0”并失去数字精度	|

## **其他问题**
							
错误编号	|	Apache JIRA	|	Apache组件	|	摘要	|
----------	|	----------	|	----------	|	----------	|
BUG-122279	|	[HADOOP-16640](https://issues.apache.org/jira/browse/HADOOP-16640)	|	Hadoop常见	|	WASB：覆盖getCanonicalServiceName（）以返回WASB文件系统的完整URL	|
BUG-122067	|	不可用	|	HBase	|	在ams-hbase中添加hadoop-aws依赖项	|
BUG-122066	|	不可用	|	HBase	|	为AWS依赖项构建hbase阴影jar	|
BUG-122521	|	[HIVE-22948](https://issues.apache.org/jira/browse/HIVE-22948)	|	HIVE	|	Schematool合并目录	|
BUG-122494	|	不可用	|	HIVE	|	Spark不应写入配置单元存储桶表	|
BUG-122492	|	不可用	|	HIVE	|	HMS应该向客户端返回真实的元数据，而没有存储功能	|
BUG-122368	|	[HIVE-22429](https://issues.apache.org/jira/browse/HIVE-22429)	|	HIVE	|	在配置单元3上使用bucketing_version 1迁移的聚集表将bucketing_version 2用于插入	|
BUG-121519	|	[HIVE-22009](https://issues.apache.org/jira/browse/HIVE-22009)	|	HIVE	|	用户指定位置的CTLV不适用	|
BUG-122308	|	不可用	|	KNOX	|	KNOX代理相关的更改	|
BUG-122275	|	[RANGER-2538](https://issues.apache.org/jira/browse/RANGER-2538)	|	RANGER	|	通过Knox可信代理的Ranger策略导入调用失败	|
BUG-122206	|	[RANGER-2531](https://issues.apache.org/jira/browse/RANGER-2531 RANGER-2552)<br>[RANGER-2552](https://issues.apache.org/jira/browse/RANGER-2552)	|	RANGER	|	从组中删除用户未正确反映在基于UNIX的同步中。	|
BUG-122189	|	[RANGER-2597](https://issues.apache.org/jira/browse/RANGER-2597)	|	RANGER	|	允许审核员角色用户从公共API获取服务和策略的详细信息	|
BUG-121945	|	[RANGER-2507](https://issues.apache.org/jira/browse/RANGER-2507)<br>[RANGER-2517](https://issues.apache.org/jira/browse/RANGER-2517)<br>[RANGER-2526](https://issues.apache.org/jira/browse/RANGER-2526)<br>[RANGER-2569](https://issues.apache.org/jira/browse/RANGER-2569)<br>[RANGER-2574](https://issues.apache.org/jira/browse/RANGER-2574)	|	RANGER	|	支持拒绝所有其他功能	|
BUG-121921	|	[RANGER-2528](https://issues.apache.org/jira/browse/RANGER-2528)<br>[RANGER-2580](https://issues.apache.org/jira/browse/RANGER-2580)	|	RANGER	|	导入/导出API的改进	|
BUG-122493	|		|	SPARK	|	Spark客户端不会向HMS发送存储桶功能	|

## **性能问题**

错误编号	|	Apache JIRA	|	Apache组件	|	摘要	|
----------	|	----------	|	----------	|	----------	|
BUG-122153	|	[HADOOP-16548](https://issues.apache.org/jira/browse/HADOOP-16548)	|	Hadoop常见	|	ABFS：配置以启用/禁用刷新操作	|
BUG-122152	|	[HADOOP-16404](https://issues.apache.org/jira/browse/HADOOP-16404)	|	Hadoop常见	|	ABFS默认块大小更改（512MB从512MB）	|
BUG-122030	|	[HDFS-14171](https://issues.apache.org/jira/browse/HDFS-14171)<br>[HDFS-14366](https://issues.apache.org/jira/browse/HDFS-14366)<br>[HDFS-14632](https://issues.apache.org/jira/browse/HDFS-14632)<br>[HDFS-14859](https://issues.apache.org/jira/browse/HDFS-14859)	|	HDFS	|	改进名称节点启动	|
BUG-121849	|	[HIVE-19661](https://issues.apache.org/jira/browse/HIVE-19661)<br>[HIVE-21171](https://issues.apache.org/jira/browse/HIVE-21171)<br>[HIVE-21182](https://issues.apache.org/jira/browse/HIVE-21182)<br>[HIVE-22106](https://issues.apache.org/jira/browse/HIVE-22106)<br>[HIVE-22115](https://issues.apache.org/jira/browse/HIVE-22115)<br>[HIVE-22161](https://issues.apache.org/jira/browse/HIVE-22161)<br>[HIVE-22168](https://issues.apache.org/jira/browse/HIVE-22168)<br>[HIVE-22169](https://issues.apache.org/jira/browse/HIVE-22169)<br>[HIVE-22204](https://issues.apache.org/jira/browse/HIVE-22204)	|	HIVE	|	查询性能修复	|
BUG-121846	|	[HIVE-22221](https://issues.apache.org/jira/browse/HIVE-22221)	|	HIVE	|	Llap外部客户端-需要减少LlapBaseInputFormat＃getSplits（）的占用空间	|
BUG-121837	|	[HIVE-21177](https://issues.apache.org/jira/browse/HIVE-21177)	|	HIVE	|	优化AcidUtils.getLogicalLength（）	|
BUG-121177	|	[HIVE-20113](https://issues.apache.org/jira/browse/HIVE-20113)	|	HIVE	|	避免随机播放：禁用1-1条边缘以进行随机播放	|
BUG-115077	|	[HIVE-20932](https://issues.apache.org/jira/browse/HIVE-20932)	|	HIVE	|	矢量化Druid存储处理程序读取器	|
BUG-121862	|	不可用	|	HWC	|	HiveWarehouseDataReaderFactory中的快速序列化	|
BUG-122550	|	[RANGER-2637](https://issues.apache.org/jira/browse/RANGER-2637)<br>[RANGER-2651](https://issues.apache.org/jira/browse/RANGER-2651)	|	RANGER	|	性能提升	|
BUG-122226	|	[TEZ-4075](https://issues.apache.org/jira/browse/TEZ-4075)<br>[TEZ-4088](https://issues.apache.org/jira/browse/TEZ-4088)<br>[TEZ-4091](https://issues.apache.org/jira/browse/TEZ-4091)	|	特兹	|	查询性能会随着时间而下降，并且LLAP需要频繁重启才能恢复。	|
错误121078	|	[TEZ-4075](https://issues.apache.org/jira/browse/TEZ-4075)	|	特兹	|	Tez：重新实现tez.runtime.transfer.data-via-events.enabled	|

## **查询失败问题**

错误编号	|	Apache JIRA	|	Apache组件	|	摘要
----------	|	----------	|	----------	|	----------
BUG-121613	|	[HADOOP-16247](https://issues.apache.org/jira/browse/HADOOP-16247)	|	HDFS	|	FsUrlConnection中的NPE
BUG-122113	|	[HIVE-22208](https://issues.apache.org/jira/browse/HIVE-22208)	|	HIVE	|	重写包含掩码列的表的查询时，将保留带有保留关键字的列名
BUG-121967	|	[HIVE-22231](https://issues.apache.org/jira/browse/HIVE-22231)	|	HIVE	|	通过knox进行大尺寸的配置单元查询失败，并且管道损坏写入失败
BUG-121842	|	[HIVE-21799](https://issues.apache.org/jira/browse/HIVE-21799)	|	HIVE	|	当联接键位于聚合列上时，DynamicPartitionPruningOptimization中的NullPointerException
BUG-121822	|	[HIVE-15956](https://issues.apache.org/jira/browse/HIVE-15956)	|	HIVE	|	删除大量分区时出现StackOverflowError
BUG-121682	|	[HIVE-21280](https://issues.apache.org/jira/browse/HIVE-21280)<br>[ORC-540](https://issues.apache.org/jira/browse/ORC-540)	|	HIVE	|	对MM表运行压缩时，空指针异常。
BUG-121634	|	[HIVE-22120](https://issues.apache.org/jira/browse/HIVE-22120)	|	HIVE	|	修复特定边界条件下左外图连接中错误的result / ArrayOutOfBound异常
BUG-122407	|	不可用	|	HWC	|	插入覆盖到托管表中显示“与文件格式不匹配”​​异常。
BUG-121727	|	不可用	|	HWC	|	HWC：为多个查询共享一个父数据帧会导致Spark v2.3.x中出现问题（实际修复）
BUG-121781	|	[SPARK-26307](https://issues.apache.org/jira/browse/SPARK-26307)	|	SPARK	|	使用Hive Serde插入分区表时修复CTAS
BUG-121408	|	[SPARK-25271](https://issues.apache.org/jira/browse/SPARK-25271)	|	SPARK	|	使用所有列为null的创建镶木地板表会引发异常
BUG-121406	|	[SPARK-26307](https://issues.apache.org/jira/browse/SPARK-26307)	|	SPARK	|	使用Hive Serde插入分区表时修复CTAS

## **安全问题**

错误编号	|	Apache JIRA	|	Apache组件	|	摘要
----------	|	----------	|	----------	|	----------
BUG-122199	|	[HADOOP-16619](https://issues.apache.org/jira/browse/HADOOP-16619)	|	Hadoop常见	|	将杰克逊和杰克逊数据绑定升级到2.9.10
BUG-122198	|	[HADOOP-16533](https://issues.apache.org/jira/browse/HADOOP-16533)	|	Hadoop常见	|	将jackson-databind更新为2.9.9.3
BUG-122197	|	[HADOOP-16487](https://issues.apache.org/jira/browse/HADOOP-16487)	|	Hadoop常见	|	将jackson-databind更新为2.9.9.2
BUG-122158	|	不可用	|	Hadoop常见	|	将Jackson-Databind升级到2.10.0
BUG-122103	|	不可用	|	HDFS	|	修复潜在的FsImage损坏-CVE-2018-11768
BUG-122094	|	[HIVE-22273](https://issues.apache.org/jira/browse/HIVE-22273)	|	HIVE	|	删除临时目录后，访问检查失败
BUG-122008	|	[HIVE-22243](https://issues.apache.org/jira/browse/HIVE-22243)	|	HIVE	|	在独立元存储中也将Apache Thrift版本调整为0.9.3-1
BUG-121671	|	不可用	|	HIVE	|	在ORC中升级到Guava 28.0-jre
BUG-122085	|	不可用	|	Livy	|	将Netty升级到4.1.42.Final
BUG-122084	|	[LIVY-695](https://issues.apache.org/jira/browse/LIVY-695)	|	Livy	|	将JQuery升级到3.4.1并将Bootstrap升级到3.4.1
BUG-122082	|	不可用	|	Livy	|	将Jackson升级到2.10.0
BUG-121900	|	[OOZIE-3543](https://issues.apache.org/jira/browse/OOZIE-3543)	|	Oozie	|	将石英升级到2.3.1
BUG-121899	|	[OOZIE-3544](https://issues.apache.org/jira/browse/OOZIE-3544)	|	Oozie	|	将commons-beanutils升级到1.9.4
BUG-122139	|	不可用	|	SPARK	|	将Jackson升级到2.10.0
BUG-122131	|	[SPARK-29445](https://issues.apache.org/jira/browse/SPARK-29445)	|	SPARK	|	将净资产从4.1.39.Final最终提高到4.1.42.Final
BUG-122130	|	不可用	|	SPARK	|	将Jackson升级到2.10.0
BUG-121389	|	[SPARK-26895](https://issues.apache.org/jira/browse/SPARK-26895)	|	SPARK	|	当以代理用户（--proxy-user）身份运行spark 2.3时，SparkSubmit无法解析目标用户所拥有的glob
BUG-121841	|	[SQOOP-3447](https://issues.apache.org/jira/browse/SQOOP-3447)	|	Sqoop	|	删除org.codehaus.jackson和org.json包的用法
BUG-121930	|	[STORM3201](https://issues.apache.org/jira/browse/STORM3201)	|	STORM	|	UI上的kafka喷口滞后需要清除-CVE-2018-11779

## **稳定性**

错误编号	|	Apache JIRA	|	Apache组件	|	摘要
----------	|	----------	|	----------	|	----------
BUG-122155	|	[HADOOP-16578](https://issues.apache.org/jira/browse/HADOOP-16578)	|	Hadoop常见	|	ABFS：fileSystemExists（）不应调用容器级API
BUG-121929	|	[HADOOP-16248](https://issues.apache.org/jira/browse/HADOOP-16248)<br>[HADOOP-16278](https://issues.apache.org/jira/browse/HADOOP-16278)	|	Hadoop常见	|	与Hive Metastore相关的不稳定问题
BUG-121515	|	[HDFS-14042](https://issues.apache.org/jira/browse/HDFS-14042)	|	Hadoop常见	|	缺少提供的存储时修复NPE
BUG-121935	|	[HBASE-22380](https://issues.apache.org/jira/browse/HBASE-22380)	|	HBase	|	批量加载时中断循环复制
BUG-122241	|	[HDFS-14423](https://issues.apache.org/jira/browse/HDFS-14423)<br>[YARN-9893](https://issues.apache.org/jira/browse/YARN-9893)	|	HDFS	|	稳定性修复
BUG-121613	|	[HADOOP-16247](https://issues.apache.org/jira/browse/HADOOP-16247)	|	HDFS	|	FsUrlConnection中的NPE
BUG-122324	|	[HIVE-22373](https://issues.apache.org/jira/browse/HIVE-22373)	|	HIVE	|	重用容器时文件合并任务失败
BUG-122201	|	[HIVE-22219](https://issues.apache.org/jira/browse/HIVE-22219)	|	HIVE	|	关闭节点管理器可阻止LLAP服务重新启动
BUG-122106	|	[HIVE-22275](https://issues.apache.org/jira/browse/HIVE-22275)	|	HIVE	|	OperationManager.queryIdOperation无法正确清理多个queryId
BUG-121959	|	[HIVE-21866](https://issues.apache.org/jira/browse/HIVE-21866)	|	HIVE	|	LLAP状态服务驱动程序可能因错误的Yarn应用程序ID卡住了
BUG-121623	|	[HIVE-22113](https://issues.apache.org/jira/browse/HIVE-22113)	|	HIVE	|	防止在与AMReporter相关的RuntimeException上关闭LLAP
BUG-121609	|	[HIVE-22068](https://issues.apache.org/jira/browse/HIVE-22068)	|	HIVE	|	返回转储为repl状态的最后一个事件ID，以避免通知事件丢失错误。
BUG-121421	|	[PHOENIX5188](https://issues.apache.org/jira/browse/PHOENIX5188)<br>[PHOENIX5289](https://issues.apache.org/jira/browse/PHOENIX5289)	|	PHOENIX	|	NPE使用Phoenix在WAL中读取KeyValue
BUG-122525	|	[YARN-9968](https://issues.apache.org/jira/browse/YARN-9968)	|	YARN	|	由于NullPointerException，公共本地化程序正在NodeManager中退出
BUG-122252	|	[YARN-9921](https://issues.apache.org/jira/browse/YARN-9921)	|	YARN	|	当YARN Service AM因组件故障重试分配时，PlacementConstraint中存在问题。
BUG-122121	|	[YARN-9816](https://issues.apache.org/jira/browse/YARN-9816)	|	YARN	|	当/ ats / active下存在不需要的文件时，EntityGroupFSTimelineStore＃scanActiveLogs失败。
BUG-122120	|	[YARN-9744](https://issues.apache.org/jira/browse/YARN-9744)	|	YARN	|	NPE使RollingLevelDBTimelineStore.getEntityByTime失败
BUG-121938	|	[YARN-8015](https://issues.apache.org/jira/browse/YARN-8015)<br>[YARN-9209](https://issues.apache.org/jira/browse/YARN-9209)	|	YARN	|	如果未在“放置约束”中设置nodePartition，则仅在默认分区中分配容器

## **可支持性**

错误编号	|	Apache JIRA	|	Apache组件	|	摘要
----------	|	----------	|	----------	|	----------
BUG-121578	|	[HIVE-22129](https://issues.apache.org/jira/browse/HIVE-22129)<br>[HIVE-22134](https://issues.apache.org/jira/browse/HIVE-22134)	|	HIVE	|	Hive 3.1驱动程序包括org.glassfish.jersey。*，它可能会干扰Cognos
BUG-121499	|	[HIVE-21009](https://issues.apache.org/jira/browse/HIVE-21009)	|	HIVE	|	LDAP-为ldap-search指定binddn
BUG-121863	|	不可用	|	HWC	|	HIVE HiveWarehouseSession（）。HIVE_WAREHOUSE_CONNECTOR类是静态的，不能在该类之外访问。
BUG-122317	|	不可用	|	Oozie	|	Bigtop-Tomcat Ubuntu软件包未升级
BUG-122014	|	[OOZIE-3551](https://issues.apache.org/jira/browse/OOZIE-3551)	|	Oozie	|	在Oozie中为Spark操作配置工作默认值
BUG-121875	|	[OOZIE-3542](https://issues.apache.org/jira/browse/OOZIE-3542)	|	Oozie	|	在ECPolicyDisabler中处理更好的旧Hdfs实现
BUG-121836	|	[OOZIE-3405](https://issues.apache.org/jira/browse/OOZIE-3405)	|	Oozie	|	SSH操作显示空错误消息和错误代码
BUG-121783	|		|	SPARK	|	在spark中设置spark.sql.parquet.writeLegacyFormat = true

## **易用性**

错误编号	|	Apache JIRA	|	Apache组件	|	摘要
----------	|	----------	|	----------	|	----------
BUG-121956	|	[HIVE-22241](https://issues.apache.org/jira/browse/HIVE-22241)	|	HIVE	|	实施UDF以使用其内部表示形式和Gregorian-Julian混合日历来解释日期/时间戳
BUG-121535	|	[HIVE-22110](https://issues.apache.org/jira/browse/HIVE-22110)	|	HIVE	|	在开始实际转储之前初始化ReplChangeManager
BUG-122276	|	不可用	|	HWC	|	HWC不会传播一些conf到配置单元
BUG-121835	|	[OOZIE-3024](https://issues.apache.org/jira/browse/OOZIE-3024)	|	Oozie	|	设置附件属性后，电子邮件操作将忽略content_type属性的值
BUG-122458	|	[PHOENIX-5552](https://issues.apache.org/jira/browse/PHOENIX-5552)	|	PHOENIX	|	针对Phoenix的Hive在Tez模式下获得“期望的“ RPAREN”，获得“ L””
BUG-122051	|	[PHOENIX-5506](https://issues.apache.org/jira/browse/PHOENIX-5506)	|	PHOENIX	|	Psql加载失败，并使用较低的表名
BUG-122023	|	[RANGER-1912](https://issues.apache.org/jira/browse/RANGER-1912)	|	RANGER	|	启用二进制日志记录后，Ranger的安装程序与mariadb / mysql一起失败
BUG-121869	|	[HIVE-12261](https://issues.apache.org/jira/browse/HIVE-12261)<br> [HIVE-14080](https://issues.apache.org/jira/browse/HIVE-14080)	|	SPARK	|	运行spark-sql命令时，在数据库中更新了错误的Hive版本。
BUG-121686	|	[YARN-9197](https://issues.apache.org/jira/browse/YARN-9197)	|	YARN	|	无法启动容器时，服务中的NPE处于启动状态