# Apache Hadoop 3.2.0发行说明

这些发行说明涵盖了新的开发人员和面向用户的不兼容性，重要问题，功能和重大改进。

* HADOOP-14667 | 专业 | 灵活的Visual Studio支持
此更改更新了Microsoft Windows构建方向，使其在Visual Studio编译器版本方面更加灵活：

可以使用任何版本的Visual Studio 2010 Pro或更高版本。
在构建时，MSBuild解决方案文件将转换为VS版本
在使用maven之前设置命令路径的示例命令文件，以便进行转换
此外，使用bin作为DLL位置的Snappy和ISA-L现在将被识别，如果设置了前缀，则无需设置它们各自的lib路径。

贡献者注意：

对于任何修补程序来说，解决方案都保持在VS 2010级别非常重要。

* YARN-6257 | 未成年人 | CapacityScheduler REST API产生不正确的JSON-JSON对象操作信息包含重复键
优化了资源管理器的REST API端点“ ws / v1 / cluster / scheduler”的响应格式，其中“ operationInfos”字段从映射转换为列表。此更改使内容对JSON解析器更友好。

* HADOOP-15146 | 未成年人 | 删除DataOutputByteBuffer
此jira帮助删除了私有和未使用的类DataOutputByteBuffer。

* MAPREDUCE-7069 | 专业 | 增加了分别指定用户环境变量的功能
现在可以将MapReduce任务的环境变量指定为单独的属性，例如：mapreduce.map.env.VARNAME = value mapreduce.reduce.env.VARNAME = value yarn.app.mapreduce.am.env.VARNAME = value yarn.app。 mapreduce.am.admin.user.env.VARNAME = value当环境变量的值包含逗号时，这种指定环境变量的形式很有用。

* HADOOP-15446 | 专业 | WASB：PageBlobInputStream.skip中断HBASE复制
WASB：错误修复，以支持非顺序页面Blob读取。HBASE复制所需。

* HDFS-13589 | 专业 | 添加dfsAdmin命令以查询“升级”是否已完成
新命令已添加到dfsadmin。hdfs dfsadmin [-upgrade [查询| finalize] 1. -upgrade查询给出upgradeStatus 2. -upgrade finalize等效于-finalizeUpgrade。

纱-8191 | 专业 | 公平的调度程序：无需重新启动RM即可删除队列
为了支持具有RM重新启动功能的队列删除，更改了AllocationFileLoaderService构造函数签名。YARN-8390对此进行了更正，并进行了兼容更改。

* HADOOP-15477 | 琐碎的 | 使RunJar中的unjar可重写
如果HADOOP_CLIENT_SKIP_UNJAR环境变量设置为true，则Apache Hadoop RunJar将跳过对提供的jar的解压缩。

* HADOOP-15506 | 未成年人 | 将Azure Storage Sdk版本升级到7.0.0并更新相应的代码块
WASB：通过将Azure Storage Java SDK更新到7.0，修复了由于使用非守护程序线程而导致Spark进程在关闭时挂起的问题

* HDFS-13174 | 专业 | hdfs mover -p / path 20分钟后超时
如果由于在Balancer中引入了一个内部常量而在两个DataNode之间将块移动如此长时间排队，则Mover可能会在20分钟后失败，但也会影响Mover。修补程序之后，可以使用dfs.balancer.max-iteration-time参数配置内部常数，并且仅影响Balancer。默认值为20分钟。

* HADOOP-15495 | 专业 | 在hadoop-common-project和hadoop-tools中将common-lang版本升级到3.7
commons-lang版本2.6已从Apache Hadoop中删除。如果将commons-lang 2.6用作Hadoop的传递依赖项，则需要直接添加该依赖项。注意：这也意味着share / hadoop / common / lib /中不存在

* HDFS-13322 | 未成年人 | 保险丝dfs-在票证缓存之间切换时，uid仍然存在
如果在同一本地用户会话中的两个文件系统访问之间通过KRB5CCNAME环境变量在Kerberos票证高速缓存路径中进行了更改，则FUSE lib现在可以识别Kerberos票证高速缓存路径的更改。

* HADOOP-15638 | 专业 | Hadoop 3.x中的KMS接受队列大小默认值从500更改为128
在Hadoop 3.x中将KMS接受队列大小恢复为500，使其与Hadoop 2.x中的相同。

* HADOOP-15669 | 专业 | ABFS：提高HTTPS性能
ABFS：改进的HTTPS性能

* HADOOP-15660 | 专业 | ABFS：添加对OAuth的支持
ABFS：支持OAuth

* HDFS-13806 | 未成年人 | EC：取消目录的EC策略的错误消息不会从祖先目录继承擦除编码策略
进行此更改后，尝试在未显式设置EC策略的目录上进行unsetErasureCodingPolicy（）的操作，将获得NoECPolicySetException。

* HADOOP-14833 | 专业 | 删除s3a用户：秘密身份验证
S3A连接器不再支持用户名和``''形式的URL中的秘密。停止记录这些机密几乎是不可能的，这就是为什么从Hadoop 2.8开始打印警告的原因。s3a：// key：secret @ bucket /

修复：使用更安全的机制来传递秘密。

纱3409 | 专业 | 支持节点属性功能
通过此功能任务，YARN中支持节点属性，这将帮助用户有效地使用资源并根据群集中每个节点的特性分配给应用程序。

* HADOOP-15684 | 关键 | ConnectTimeoutException发生时，triggerActiveLogRoll卡在死名称节点上。
当名称节点A向远程NN发送请求RollEditLog时，要么远程NN处于待机状态，要么发生IO异常，A应该继续尝试下一个NN，而不是卡在有问题的NN上。该补丁基于主干。

* HDFS-10285 | 专业 | HDFS中的存储策略满意度
StoragePolicySatisfier（SPS）允许用户跟踪并满足HDFS中给定文件/目录的存储策略要求。用户可以通过调用“ hdfs storagepolicies -satisfyStoragePolicy -path <路径>”命令或通过HdfsAdmin＃satisfyStoragePolicy（path）API来指定文件/目录路径。对于存储策略不匹配的块，它将副本复制到其他存储类型，以满足存储策略要求。由于API调用转到NN来跟踪调用的满足条件的路径（iNode），因此管理员需要在NN上启用dfs.storage.policy.satisfier.mode的配置以允许这些操作。可以通过在hdfs-site.xml中将'dfs.storage.policy.satisfier.mode'设置为'external'来启用它。可以动态禁用配置，而无需重新启动Namenode。应该使用“ hdfs –daemon start sps”在Namenode外部启动SPS。如果管理员希望明确运行Mover工具，则他/她应确保先禁用SPS，然后再运行Mover。有关详细用法，请参阅《归档存储》指南中的“存储策略满意（SPS）”部分。

* HADOOP-15407 | 阻断剂 | 支持Windows Azure存储-Hadoop中的Blob文件系统
* hadoop-azure模块中的abfs连接器支持Microsoft Azure Datalake（第2代），在撰写本文时（2018年9月）处于预览阶段，即将推出GA。与所有云连接器一样，拐角处将不可避免地浮出水面。如果遇到问题，请提交错误报告。

* HADOOP-14445 | 专业 | 使用委派令牌Issuer创建可以对所有KMS实例进行身份验证的KMS委派令牌
此修补程序改进了KMS委派令牌发行和身份验证逻辑，以使令牌能够与一组KMS服务器进行身份验证。更改是向后兼容的，因为它保留了现有的身份验证逻辑作为回退。

从历史上看，KMS委派令牌将ip：port作为服务，即使令牌在服务器端的所有KMS服务器之间共享，KMS客户端也只能使用令牌对指定为ip：port的KMS服务器进行身份验证。此修补程序之后，新创建的令牌将把KMS URL作为服务。

引入了一个委托令牌Issuer接口来创建令牌。

* HDFS-14053 | 专业 | 为NN提供基于拓扑更改进行重新复制的功能。
新选项（-replicate）已添加到fsck命令，以重新触发复制以查找错误复制的块。应该使用此选项，而不是先前使用的解决方法来增加然后减少复制因子（使用hadoop fs -setrep命令）。

* HADOOP-15996 | 专业 | 插件界面支持Hadoop中更复杂的用户名
此修补程序启用“ Hadoop”和“ MIT”作为“ hadoop.security.auth_to_local.mechanism”的选项，默认为“ hadoop”。这应该与HADOOP-12751之前的版本向后兼容。

这基本上是HADOOP-12751加上可配置的+扩展的测试。

©2008-2019 Apache Software