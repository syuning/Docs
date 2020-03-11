# 卸载ambari
yum remove -y ambari-infra-solr-client-2.7.3.0-139.noarch ambari-infra-solr-client-2.7.3.0-139.noarch ambari-agent-2.7.3.0-1.x86_64 ambari-metrics-monitor-2.7.3.0-139.x86_64 ambari-server-2.7.3.0-0.x86_64 ambari-metrics-collector-2.7.3.0-139.x86_64 ambari-metrics-grafana-2.7.3.0-139.x86_64 ambari-metrics-hadoop-sink-2.7.3.0-139.x86_64 ambari-infra-solr-2.7.3.0-139.noarch

# 卸载HDP
yum remove -y *3_1_0_0_78*

yum remove -y hdp-select.noarch bigtop-jsvc.x86_64 hdp-select.noarch bigtop-jsvc.x86_64

rm -rf /var/hdp

# 删除数据库
mysql -uroot -pbigdata

drop database ambari;
drop database hive;
drop database oozie;
drop database ranger;

# 删除所有日志文件夹、Hadoop文件夹、配置文件夹、PID、库文件夹、/var/tmp/*、符号链接、服务用户

rm -rf /var/log/ambari-agent
rm -rf /var/log/ambari-metrics-grafana
rm -rf /var/log/ambari-metrics-monitor
rm -rf /var/log/ambari-server/
rm -rf /var/log/falcon
rm -rf /var/log/hbase
rm -rf /var/log/flume
rm -rf /var/log/hadoop
rm -rf /var/log/hadoop-mapreduce
rm -rf /var/log/hadoop-yarn
rm -rf /var/log/hive
rm -rf /var/log/hive-hcatalog
rm -rf /var/log/hive2
rm -rf /var/log/hst
rm -rf /var/log/knox
rm -rf /var/log/oozie
rm -rf /var/log/solr
rm -rf /var/log/zookeeper

rm -rf /hadoop
rm -rf /hdfs
rm -rf /home/hdfs
rm -rf /home/ranger
rm -rf /local/opt/hadoop
rm -rf /tmp/*
rm -rf /usr/bin/hadoop
rm -rf /usr/hdp
rm -rf /var/hadoop

rm -rf /etc/ambari-agent
rm -rf /etc/ambari-metrics-grafana
rm -rf /etc/ambari-server
rm -rf /etc/ams-hbase
rm -rf /etc/falcon
rm -rf /etc/flume
rm -rf /etc/hadoop
rm -rf /etc/hadoop-httpfs
rm -rf /etc/hbase
rm -rf /etc/hive
rm -rf /etc/hive-hcatalog
rm -rf /etc/hive-webhcat
rm -rf /etc/hive2
rm -rf /etc/hst
rm -rf /etc/knox
rm -rf /etc/livy
rm -rf /etc/mahout
rm -rf /etc/oozie
rm -rf /etc/phoenix
rm -rf /etc/pig
rm -rf /etc/ranger
rm -rf /etc/ranger-admin
rm -rf /etc/ranger-usersync
rm -rf /etc/ranger-tagsync/
rm -rf /etc/spark2
rm -rf /etc/tez
rm -rf /etc/tez_hive2
rm -rf /etc/zookeeper

rm -rf /var/run/ambari-agent
rm -rf /var/run/ambari-metrics-grafana
rm -rf /var/run/ambari-server
rm -rf /var/run/falcon
rm -rf /var/run/flume
rm -rf /var/run/hadoop
rm -rf /var/run/hadoop-mapreduce
rm -rf /var/run/hadoop-yarn
rm -rf /var/run/hbase
rm -rf /var/run/hive
rm -rf /var/run/hive-hcatalog
rm -rf /var/run/hive2
rm -rf /var/run/hst
rm -rf /var/run/knox
rm -rf /var/run/oozie
rm -rf /var/run/webhcat
rm -rf /var/run/zookeeper

rm -rf /usr/lib/ambari-agent
rm -rf /usr/lib/ambari-infra-solr-client
rm -rf /usr/lib/ambari-metrics-hadoop-sink
rm -rf /usr/lib/ambari-metrics-kafka-sink
rm -rf /usr/lib/ambari-server-backups
rm -rf /usr/lib/ams-hbase
rm -rf /usr/lib/mysql
rm -rf /usr/lib/storm
rm -rf /usr/lib/flume
rm -rf /var/lib/ambari-agent
rm -rf /var/lib/ambari-metrics-grafana
rm -rf /var/lib/ambari-server
rm -rf /var/lib/flume
rm -rf /var/lib/hadoop-hdfs
rm -rf /var/lib/hadoop-mapreduce
rm -rf /var/lib/hadoop-yarn
rm -rf /var/lib/hive
rm -rf /var/lib/hive2
rm -rf /var/lib/knox
rm -rf /var/lib/smartsense
rm -rf /var/lib/storm
rm -rf /var/lib/ambari-metrics-collector
rm -rf /var/lib/ambari-metrics-monitor
rm -rf /var/lib/ambari-infra-solr
rm -rf /var/lib/ranger
rm -rf /var/lib/spark2

rm -rf /var/tmp/*
rm -rf /tmp/*

cd /usr/bin
rm -rf accumulo
rm -rf atlas-start
rm -rf atlas-stop
rm -rf beeline
rm -rf falcon
rm -rf flume-ng
rm -rf hbase
rm -rf hcat
rm -rf hdfs
rm -rf hive
rm -rf hiveserver2
rm -rf kafka
rm -rf mahout
rm -rf mapred
rm -rf oozie
rm -rf oozied.sh
rm -rf phoenix-psql
rm -rf phoenix-queryserver
rm -rf phoenix-sqlline
rm -rf phoenix-sqlline-thin
rm -rf pig
rm -rf python-wrap
rm -rf ranger-admin
rm -rf ranger-admin-start
rm -rf ranger-admin-stop
rm -rf ranger-kms
rm -rf ranger-usersync
rm -rf ranger-usersync-start
rm -rf ranger-usersync-stop
rm -rf slider
rm -rf sqoop
rm -rf sqoop-codegen
rm -rf sqoop-create-hive-table
rm -rf sqoop-eval
rm -rf sqoop-export
rm -rf sqoop-help
rm -rf sqoop-import
rm -rf sqoop-import-all-tables
rm -rf sqoop-job
rm -rf sqoop-list-databases
rm -rf sqoop-list-tables
rm -rf sqoop-merge
rm -rf sqoop-metastore
rm -rf sqoop-version
rm -rf storm
rm -rf storm-slider
rm -rf worker-lanucher
rm -rf yarn
rm -rf zookeeper-client
rm -rf zookeeper-server
rm -rf zookeeper-server-cleanup

rm -rf /run/flink
rm -rf /run/spark2
rm -rf /run/ranger
rm -rf /run/ambari-infra-solr 
rm -rf /run/ambari-metrics-collector
rm -rf /run/ambari-metrics-monitor
rm -rf /run/elasticsearch
rm -rf /run/hadoop-yarn-hbase
rm -rf /run/janusgraph

userdel -r accumulo
userdel -r ambari-qa
userdel -r ams
userdel -r falcon
userdel -r flume
userdel -r hbase
userdel -r hcat
userdel -r hdfs
userdel -r hive
userdel -r kafka
userdel -r knox
userdel -r mapred
userdel -r oozie
userdel -r ranger
userdel -r spark
userdel -r sqoop
userdel -r storm
userdel -r tez
userdel -r yarn
userdel -r zeppelin
userdel -r zookeeper

rm -rf /var/spool/mail/

# 查找卸载残留
find / -name ambari
find / -name accumulo
find / -name atlas
find / -name beeline
find / -name falcon
find / -name flume
find / -name hadoop
find / -name hbase
find / -name hcat
find / -name hdfs
find / -name hdp
find / -name hive
find / -name hiveserver2
find / -name kafka
find / -name mahout
find / -name mapred
find / -name oozie
find / -name phoenix
find / -name pig
find / -name ranger
find / -name slider
find / -name sqoop
find / -name storm
find / -name yarn
find / -name zookeeper

# 重启节点

reboot