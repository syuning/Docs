#/bin/bash

# apt list --installed


# Stop the server/agents then remove
ambari-server stop 
ambari-agent stop
temp_rpm_ambari=$(apt list --installed | grep ambari | awk -F' ' '{print $1}')
for item_ambari in $temp_rpm_ambari
 do
  apt-get --purge remove $item_ambari
 done

apt remove --purge ambari-server
apt remove --purge ambari-agent
apt remove --purge postgresql
apt remove --purge hdp-select

rm -rf /var/lib/pgsql/data/
rm -rf /usr/lib/ambari-server
rm -rf /usr/sbin/ambari_server_main.pyc
rm -rf /var/run/ambari-server
rm -rf /var/lib/ambari*
rm -rf /var/log/ambari*
rm -rf /etc/ambari*


# HDP
temp_rpm=$(apt list --installed | grep HDP* | awk -F' ' '{print $1}')
for item in $temp_rpm
 do
  apt remove --purge $item
 done

apt remove --purge ranger*
apt remove --purge spark*
apt remove --purge zookeeper*
apt remove --purge atlas*
apt remove --purge hadoop*


# Delete all users and home files
userdel -rf yarn
userdel -rf spark
userdel -rf ams
userdel -rf tez
userdel -rf hbase
userdel -rf zookeeper
userdel -rf hdfs
userdel -rf flume
userdel -rf storm
userdel -rf mahout
userdel -rf kafka
userdel -rf hue
userdel -rf ambari-qa
userdel -rf mapred 
userdel -rf solr
userdel -rf sqoop
userdel -rf hcat
userdel -rf hive
userdel -rf nagios 
userdel -rf hbase 
userdel -rf oozie 
userdel -rf rrdcached 
userdel -rf falcon
userdel -rf ranger
userdel -rf kms
userdel -rf livy
userdel -rf gpadmin
userdel -rf ml
userdel -rf postgres
userdel -rf httpfs
userdel -rf tenant
userdel -rf zeppelin

userdel -rf spark2
userdel -rf nifi
#pxf & hawq
userdel -rf pxf
userdel -rf hawq

#n5.Delete all directories
rm -rf /usr/hdp
rm -rf /hadoop
rm -rf /etc/hadoop 
rm -rf /etc/hbase 
rm -rf /etc/hcatalog 
rm -rf /etc/hive 
rm -rf /etc/ganglia 
rm -rf /etc/nagios 
rm -rf /etc/oozie 
rm -rf /etc/sqoop 
rm -rf /etc/zookeeper
rm -rf /etc/tez
rm -rf /etc/slider
rm -rf /etc/storm-slider-client
rm -rf /etc/spark
rm -rf /etc/phoenix
rm -rf /etc/flume
rm -rf /etc/kafka
rm -rf /etc/falcon
rm -rf /etc/storm	
rm -rf /etc/hive-hcatalog
rm -rf /etc/hive-webhcat
rm -rf /etc/mahout
rm -rf /etc/pig
rm -rf /etc/ranger
rm -rf /etc/atlas
rm -rf /etc/zeppelin

rm -rf /etc/nifi
rm -rf /etc/spark2
rm -rf /etc/ams-hbase
rm -rf /etc/pxf*
 
rm -rf /var/run/hadoop 
rm -rf /var/run/hbase 
rm -rf /var/run/hive 
rm -rf /var/run/ganglia 
rm -rf /var/run/nagios 
rm -rf /var/run/oozie
rm -rf /var/run/zookeeper
rm -rf /var/run/storm
rm -rf /var/run/spark
rm -rf /var/run/hive-hcatalog
rm -rf /var/run/webhcat
rm -rf /var/run/sqoop
rm -rf /var/run/storm
rm -rf /var/run/flume
rm -rf /var/run/kafka
rm -rf /var/run/hue
rm -rf /var/run/falcon
rm -rf /var/run/solr
rm -rf /var/run/dataspace
rm -rf /var/run/pxf
rm -rf /var/run/ranger_kms
rm -rf /var/run/ranger
rm -rf /var/run/ambari-metrics-collector
rm -rf /var/run/ambari-metrics-grafana
rm -rf /var/run/ambari-agent
rm -rf /var/run/hive2
rm -rf /var/run/redis
rm -rf /var/run/ml
rm -rf /var/log/hadoop 
rm -rf /var/log/hbase 
rm -rf /var/log/hive 
rm -rf /var/log/nagios 
rm -rf /var/log/oozie 
rm -rf /var/log/zookeeper 
rm -rf /var/log/storm
rm -rf /var/log/spark
rm -rf /var/log/sqoop
rm -rf /var/log/storm	
rm -rf /var/log/webhcat
rm -rf /var/log/hue
rm -rf /var/log/falcon
rm -rf /var/log/hive-hcatalog
rm -rf /var/log/hadoop-*
rm -rf /var/log/ranger
rm -rf /var/log/solr
rm -rf /var/log/audit
rm -rf /var/log/kakfa
rm -rf /var/log/ml
rm -rf /var/log/hive2
rm -rf /var/log/dataspace
rm -rf /var/log/redis
rm -rf /var/log/pxf
rm -rf /var/log/flume
rm -rf /var/log/kadmind.log*
rm -rf /var/log/krb5kdc.log*
rm -rf /var/log/zeppelin
rm -rf /tmp/hadoop-yarn
rm -rf /kafka-logs
rm -rf /var/log/kafka
rm -rf /var/lib/ranger
rm -rf /tmp/hcat
rm -rf /var/lib/flume
#spark2 and nifi 20171211
rm -rf /var/run/spark2
rm -rf /var/run/nifi
rm -rf /var/log/spark2
rm -rf /var/log/nifi

rm -rf /usr/lib/hadoop
rm -rf /usr/lib/hbase 
rm -rf /usr/lib/hcatalog 
rm -rf /usr/lib/hive 
rm -rf /usr/lib/oozie 
rm -rf /usr/lib/sqoop 
rm -rf /usr/lib/zookeeper 
rm -rf /var/lib/hive 
rm -rf /var/lib/ganglia 
rm -rf /var/lib/oozie 
rm -rf /var/lib/zookeeper
rm -rf /usr/lib/flume
rm -rf /usr/lib/storm
rm -rf /usr/lib/ambari-*
rm -rf /usr/lib/ams-hbase
rm -rf /usr/local/hue
rm -rf /usr/lib/pxf
rm -rf /usr/local/etc/nifi
rm -rf /usr/local/nifi

rm -rf /var/lib/hadoop-hdfs
rm -rf /var/lib/hadoop-yarn
rm -rf /var/lib/hadoop-mapreduce
rm -rf /var/lib/slider
rm -rf /var/tmp/sqoop
rm -rf /var/tmp/oozie
rm -rf /var/nagios
rm -rf /var/lib/nifi
rm -rf /var/pxf

rm -rf /tmp/hadoop-hdfs
rm -rf /tmp/hive 
rm -rf /tmp/nagios 
rm -rf /tmp/ambari-qa 
rm -rf /tmp/sqoop-ambari-qa
rm -rf /tmp/httpfs.pid
rm -rf /tmp/hadoop-hive 
rm -rf /tmp/hadoop-nagios 
rm -rf /tmp/hadoop-hcat 
rm -rf /tmp/hadoop-ambari-qa 
rm -rf /tmp/hsperfdata_hbase 
rm -rf /tmp/hsperfdata_hive 
rm -rf /tmp/hsperfdata_nagios 
rm -rf /tmp/hsperfdata_oozie 
rm -rf /tmp/hsperfdata_zookeeper 
rm -rf /tmp/hsperfdata_mapred 
rm -rf /tmp/hsperfdata_hdfs 
rm -rf /tmp/hsperfdata_hcat 
rm -rf /tmp/hsperfdata_ambari-qa

rm -rf /var/run/ambari-metrics-monitor
rm -rf /var/run/hadoop-*
rm -rf /etc/accumulo/2.3.0.0-2557/
rm -rf /etc/accumulo/conf.install/

rm -rf /hadoop/oozie
rm -rf /hadoop/zookeeper
rm -rf /hadoop/mapred
rm -rf /hadoop/hdfs
rm -rf /etc/init.d/solr

rm -rf /opt/ambari_infra_solr
rm -rf /opt/pxf
rm -rf /run/pxf

rm -rf /etc/security/keytabs
rm -rf /usr/local/hawq*


#6.python
cd /usr/lib/python2.6/site-packages/
rm -rf ambari_*
rm -rf resource_m*y

cd /usr/lib/python2.7/site-packages/
rm -rf ambari_*
rm -rf resource_m*y

cd /usr/local/
rm -rf greenplum*

rm -rf /tmp/hue_krb5_ccache









