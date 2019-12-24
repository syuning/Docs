
> 源文档地址：https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.4/release-notes/content/hdp_relnotes.html

# 组件版本

Hortonworks数据平台（HDP）3.1.4的正式Apache组件版本列表。为确保您使用的是最新的稳定软件，必须熟悉HDP 3.1.4中的最新Apache组件版本。您还应该了解可用的技术预览(Technical Preview)组件，并仅在测试环境中使用它们。

Hortonworks的方法是仅在必要时提供补丁程序，以确保组件的互操作性。除非Hortonworks支持人员明确指示您安装补丁，否则每个HDP组件都应保持在以下软件包版本级别，以确保HDP 3.1.4得到认证和受支持。

HDP 3.1.4的官方Apache组件版本：

* Apache Accumulo 1.7.0
* Apache Atlas 1.1.0
* Apache Calcite 1.16.0
* Apache DataFu 1.3.0
* Apache Druid 0.12.1（正在培养）
* Apache Hadoop 3.1.1
* Apache HBase 2.0.2
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

您可以使用以下 技术预览(Technical Preview)组件，但只能在测试环境中使用：

* Apache Superset 0.23.3

# 新功能说明

## **Altlas**

修复了Apache Atlas 1.1.0的许多问题，以及增加以下新功能：
* 对进程的分别执行的实例的进程执行实体的支持
* Hive Metastore挂钩，用于收集元数据
* 大量API，用于通过唯一属性来检索实体

## **Hive**

* 核心能力方面：
    * 自动分区管理可同步元数据和文件系统中的更改
    * 与以往版本相比，现在可以配置将分区数据和元数据保留多长时间
    * 现在，**Hive Warehouse Connector** 会验证列与 **Hive** 中的列之间的映射，以提醒用户输入错误
    * 将 **DataFrame** 写入Hive支持指定分区
    * 用于 **HiveWarehouseSession API** 操作支持合并表的新 **MergeBuilder** 接口

* 综合方面：
    **HiveStrictManagedMigration** 有两个新选项：
    * 指定用于并行处理表的线程数，默认值为*CPU核心数*
    * 指定要处理的表的类型，例如，MANAGED_TABLE、EXTERNAL_TABLE，默认值为*所有表*

## **Kakfa**

* 核心能力方面：
    * 新的 **Kafka Streams** 配置参数升级允许从旧版本滚动退回升级
    * **Kafka Streams** 中更新了 **ProcessorStateManager API** ，用于将状态存储注册到处理器拓扑（有关更多详细信息请阅读[Streams升级指南](https://kafka.apache.org/23/documentation/streams/upgrade-guide#streams_api_changes_200)）
    * 在启动代理之前，可以使用```kafka-configs.sh```将动态代理配置选项存储在ZooKeeper中。此选项可用于避免将清晰的密码存储在```server.properties```中，因为所有密码配置都可以加密存储在ZooKeeper中
    * 现在，如果连接尝试失败，则将重新解析ZooKeeper主机。但是，如果您的ZooKeeper主机名解析为多个地址，但其中一些无法访问，则可能需要增加连接超时 ```zookeeper.connection.timeout.ms``` 属性
    * 能够在前缀资源上定义ACL，例如，任何以”foo“开头的主题

## **Ranger**

* 核心能力方面：
    * 支持时限分类或业务目录映射。游标策略引擎可识别标签的开始和结束时间，并根据标签的有效期限实施策略
    * 支持**Safenet KeySecure加密平台**，用于存储**Ranger KMS**的主密钥
    * 支持允许用户在Ranger中定义策略级别条件

## **Spark**

* 综合方面：
    * Spark Kafka源代码与架构注册表集成

## **Zeppelin**

* 安全方面：
    * 支持基于SPNEGO的Zeppelin用户身份验证。使用基于SPNEGO的身份验证，基于LDAP / Active Directory的用户对笔记本ACL的搜索将继续起作用。

* 综合方面：
    * 从Zeppelin安装中取消捆绑Zeppelin Notebook。

# 弃用通知

从一个Hortonworks Data Platform版本升级到另一个版本时，您必须了解从最新版本中弃用、移动或删除的任何技术，并使用弃用通知作为实施计划的指南。

## 术语

本节中的项目指定如下：

### 已弃用
Hortonworks将在将来的HDP版本中删除的技术。将项目标记为已弃用可让您有时间计划在将来的HDP版本中将其删除。

### 移动
Hortonworks正在从将来的HDP版本中转移而来的技术，并将通过替代的Hortonworks产品或订阅来提供该技术。将项目标记为移动可让您有时间计划在将来的HDP版本中将其删除，并为该技术的替代Hortonworks产品或订阅进行计划。

### 已移除
Hortonworks已从HDP中删除了该技术，并且此版本不再提供或支持该技术。请注意标记为已删除的技术，因为它可能会影响您的升级计划。

## 删除了的组件和产品功能

在此HDP版本中，不存在已弃用或已删除的组件。

如有任何疑问，请联系Hortonworks支持或您的Hortonworks客户团队。

# 最新技术预览功能的描述

如果要试验Hortonworks Data Platform 3.1.4中包含的技术预览功能，则应注意这些功能尚未准备好进行生产部署。Hortonworks鼓励您在非生产环境中探索这些技术预览功能，并通过Hortonworks社区论坛提供有关您的体验的反馈 。

| Apache组件 | 技术预览功能 |
| -----|----- |
| YARN | YARN现在可以将NEC VE设备作为资源来处理。现在，工作负载可以将这些设备用于您的用例。 |

