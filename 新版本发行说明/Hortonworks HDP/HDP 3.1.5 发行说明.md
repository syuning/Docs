
> 源文档地址 https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/release-notes/content/hdp_relnotes.html

# **HDP 3.1.5 发行说明**

本文档为您提供有关Hortonworks Data Platform（HDP）3.1.5版本的最新信息。

# **组件版本**

Hortonworks数据平台（HDP）3.1.5的正式Apache组件版本列表。为确保您使用的是最新的稳定软件，必须熟悉HDP 3.1.5中的最新Apache组件版本。您还应该了解可用的技术预览（Technical Preview）组件，并仅在测试环境中使用它们。

Cloudera的方法是仅在必要时提供补丁程序，以确保组件的互操作性。除非Cloudera支持明确指示您安装补丁，否则每个HDP组件应保持在以下软件包版本级别，以确保HDP 3.1.5的认证和受支持副本。

HDP 3.1.5的官方Apache组件版本：

* Apache Accumulo 1.7.0
* Apache Atlas 2.0.0
* Apache Calcite 1.16.0
* Apache DataFu 1.3.0
* Apache Druid 0.12.1（孵化中）
* Apache Hadoop 3.1.1
* Apache HBase 2.1.6
* Apache Hive 3.1.0
* Apache Kafka 2.0.0
* Apache Knox 1.0.0
* Apache Livy 0.5.0
* Apache Oozie 4.3.1
* Apache Phoenix 5.0.0
* Apache Pig 0.16.0
* Apache Ranger 1.2.0
* Apache Spark 2.3.2
* Apache Sqoop 1.4.7
* Apache Storm 1.2.1
* Apache TEZ 0.9.1
* Apache Zeppelin 0.8.0
* Apache ZooKeeper 3.4.6

您可以使用“ 最新技术预览”功能，但只能在测试环境中使用：

* Apache Superset 0.23.3

# **新功能说明**

Hortonworks数据平台（HDP）3.1.5为您提供了一些新功能。您必须了解新功能及其好处，才能使用HDP 3.1.5中的新功能。

| Apache组件 | 特色领域，优势以及更多信息的链接 |
| ---------- | ---------- |
| Hive | **核心能力**：<br> 使用Hive Metastore（HMS）转换层支持Hive和Spark的单个目录。
| HBase  | **升级**：<br> Apache HBase已升级到Apache HBase 2.1.6。有关基本版本中未解决的HBase中添加的Apache修补程序列表的信息，请参见HBase Apache Patch Information。
| YARN | **核心能力**：<br> 现在，您可以配置队列映射以使用应用程序标记中的用户名，而不是提交作业的代理用户。 |

# **弃用通知**

从一个Hortonworks Data Platform版本升级到另一个版本时，您必须了解从最新版本中弃用，移动或删除的任何技术。使用弃用通知作为实施计划的指南。

## **术语**

本节中的项目指定如下：

### **已弃用**
Cloudera在将来的HDP版本中将删除的技术。将项目标记为已弃用可让您有时间计划在将来的HDP版本中将其删除。

### **已移动**
Cloudera正在从将来的HDP版本中转移而来的技术，并且可以通过替代的Cloudera产品或订阅来使用。将项目标记为移动可让您有时间计划在将来的HDP版本中删除，并为该技术的替代Cloudera产品或订阅计划。

### **已移除**
Cloudera已从HDP中删除了该技术，并且从此版本开始不再可用或受支持。请注意标记为已删除的技术，因为它可能会影响您的升级计划。

## **删除了的组件和产品功能**

在此HDP版本中，不存在已弃用或删除的任何组件。

如有任何疑问，请联系Cloudera支持或您的Cloudera客户团队。

# **测试还未支持的功能**

未支持的功能是HDP 3.1.5中未正式支持的那些功能。尽管HDP中存在“技术预览”和“社区功能”部分中列出的功能，但是您不能在生产中使用这些功能，因为Cloudera不支持它们。

| Apache Hadoop组件 | 不支持的功能 |
| ---------- | ----------|
|YARN | 移动应用程序操作：不支持在队列之间移动作业 |

## **最新技术预览功能的说明**

如果要尝试使用Hortonworks Data Platform 3.1.5中包含的技术预览功能，则应注意这些功能尚未准备好进行生产部署。Cloudera鼓励您在非生产环境中探索这些技术预览功能，并通过[Hortonworks社区论坛](https://community.hortonworks.com/answers/list.html)提供有关您的体验的反馈。

# **行为改变**

与先前发布的版本相比，此版本没有任何行为更改。

# **Apache补丁信息**

以下各节列出了每个HDP 3.1.5组件中的补丁程序，这些补丁程序在Apache组件的基本版本中已解决。

## **Accumulo**

此版本提供Accumulo 1.7.0，并且没有其他Apache修补程序。

## **Atlas**

此版本提供Atlas 2.0和列出的Apache修补程序。

## **Calcite**

此版本提供Calcite 1.16.0，并且没有其他Apache修补程序。

## **DataFu**

此版本提供DataFu 1.3.0，并且没有其他Apache修补程序。

## **Hadoop**

此版本提供Hadoop Common 3.1.1，并且没有其他Apache修补程序。

## **HBase**

此版本提供HBase 2.1.6和列出的Apache修补程序。

## **Hive**

此版本提供Hive 3.1.0以及HDP 3.x早期版本中提供的列出的Apache修补程序。

## **Kafka**

此版本提供Kafka 2.0.0，没有其他Apache修补程序。

## **Knox**

此版本提供Knox 1.0.0和列出的Apache修补程序。

## **Livy**

此版本提供Livy 0.5.0，没有其他修补程序。

## **Oozie**

此版本提供Oozie 4.3.1和其他Apache补丁。

## **Phoenix**

此发行版提供了Phoenix 5.0.0和以下其他Apache修补程序。

## **Pig**

此版本提供Pig 0.16.0和列出的Apache修补程序。

## **Ranger**

此版本提供Ranger 1.2.0和列出的Apache修补程序。

## **Spark**

此版本提供Spark 2.3.2和列出的Apache补丁。

## **Sqoop**

此版本提供Sqoop 1.4.7，并且没有其他Apache修补程序。

## **Storm*

此版本提供Storm 1.2.1和以下Apache修补程序。

## **Tez**

此版本提供Tez 0.9.1和列出的Apache修补程序。

## **Zeppelin**

此版本提供Zeppelin 0.8.0，并且没有其他Apache修补程序。

## **ZooKeeper**

此版本提供ZooKeeper 3.4.6和以下修补程序。

# 已修复的漏洞

此版本中没有修复常见漏洞（CVE）。

## **CVE-2018-11768**

**组件**：Apache Hadoop Common / HDFS

**摘要**：跨存储在fsimage中和从fsimage中读取信息可能会破坏用户/组信息。

**严重程度**：严重

**供应商**：Cloudera

**受影响的版本**：HDP 3.x

**受影响的用户**：在HDP 3.1.4.0或更早版本中使用HDFS的用户。

**影响**：用于存储内存和磁盘表示形式的用户/组信息的字段大小不匹配。这会导致用户/组信息在存储在fsimage中以及从fsimage读回时被破坏。

**建议的操作**：升级到HDP 3.1.5.0或更高版本。

## **CVE-2018-11779**

**组件**：Apache Storm

**摘要**：Storm UI守护程序漏洞。

**严重程度**：严重

**供应商**：Cloudera

**受影响的版本**：HDP 3.0.x，HDP 3.1.x

**受影响的用户**：使用storm-kafka-client或storm-kafka模块的用户。

**影响**：请参阅STORM-3201。可能会使Storm UI守护程序将用户提供的字节反序列化为Java类。

**建议的操作**：升级到HDP 3.1.5.0或更高版本。
