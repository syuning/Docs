#!/bin/bashS
ambari_ch_common_dir="ambari-server/src/main/resources/common-services/"
ambari_ch_host_dir="ambari-server/src/main/resources/host_scripts/"
ambari_en_common_dir="/opt/mnt/ambari-release-2.7.1/ambari-server/src/main/resources/common-services/"
ambari_en_host_dir="/opt/mnt/ambari-release-2.7.1/ambari-server/src/main/resources/host_scripts/"


\cp -f ambari-server/src/main/resources/alerts.json  /opt/mnt/ambari-release-2.7.1/ambari-server/src/main/resources/
\cp -f ${ambari_ch_common_dir}AMBARI_METRICS/0.1.0/alerts.json 			${ambari_en_common_dir}AMBARI_METRICS/0.1.0/
\cp -f ${ambari_ch_common_dir}FLUME/1.4.0.2.0/alerts.json 			${ambari_en_common_dir}FLUME/1.4.0.2.0/
\cp -f ${ambari_ch_common_dir}HBASE/0.96.0.2.0/alerts.json 			${ambari_en_common_dir}HBASE/0.96.0.2.0/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/alerts.json 			${ambari_en_common_dir}HDFS/2.1.0.2.0/
\cp -f ${ambari_ch_common_dir}HIVE/0.12.0.2.0/alerts.json 			${ambari_en_common_dir}HIVE/0.12.0.2.0/
\cp -f ${ambari_ch_common_dir}KAFKA/0.8.1/alerts.json 				${ambari_en_common_dir}KAFKA/0.8.1/
\cp -f ${ambari_ch_common_dir}KAFKA/0.9.0/alerts.json 				${ambari_en_common_dir}KAFKA/0.9.0/
\cp -f ${ambari_ch_common_dir}OOZIE/4.0.0.2.0/alerts.json 			${ambari_en_common_dir}OOZIE/4.0.0.2.0/
\cp -f ${ambari_ch_common_dir}OOZIE/4.2.0.2.3/alerts.json 			${ambari_en_common_dir}OOZIE/4.2.0.2.3/
\cp -f ${ambari_ch_common_dir}RANGER/0.5.0/alerts.json 				${ambari_en_common_dir}RANGER/0.5.0/
\cp -f ${ambari_ch_common_dir}RANGER/0.6.0/alerts.json				${ambari_en_common_dir}RANGER/0.6.0/
\cp -f ${ambari_ch_common_dir}RANGER/0.4.0/alerts.json 				${ambari_en_common_dir}RANGER/0.4.0/
\cp -f ${ambari_ch_common_dir}RANGER_KMS/0.5.0.2.3/alerts.json 			${ambari_en_common_dir}RANGER_KMS/0.5.0.2.3/
\cp -f ${ambari_ch_common_dir}SPARK/1.2.1/alerts.json 				${ambari_en_common_dir}SPARK/1.2.1/
\cp -f ${ambari_ch_common_dir}STORM/0.9.1/alerts.json 				${ambari_en_common_dir}STORM/0.9.1/
\cp -f ${ambari_ch_common_dir}YARN/2.1.0.2.0/alerts.json 			${ambari_en_common_dir}YARN/2.1.0.2.0/
\cp -f ${ambari_ch_common_dir}ZOOKEEPER/3.4.5/alerts.json 			${ambari_en_common_dir}ZOOKEEPER/3.4.5/
\cp -f ${ambari_ch_common_dir}SPARK2/2.0.0/alerts.json 				${ambari_en_common_dir}SPARK2/2.0.0/
\cp -f ${ambari_ch_common_dir}LOGSEARCH/0.5.0/alerts.json 			${ambari_en_common_dir}LOGSEARCH/0.5.0/
\cp -f ${ambari_ch_common_dir}AMBARI_INFRA/0.1.0/alerts.json 			${ambari_en_common_dir}AMBARI_INFRA/0.1.0/
\cp -f ${ambari_ch_common_dir}HAWQ/2.0.0/alerts.json                            ${ambari_en_common_dir}HAWQ/2.0.0/
\cp -f ${ambari_ch_common_dir}DATASPACE/1.0.2/alerts.json                       ${ambari_en_common_dir}DATASPACE/1.0.2/
\cp -f ${ambari_ch_common_dir}HUE/3.11.0/alerts.json                       	${ambari_en_common_dir}HUE/3.11.0/
\cp -f ${ambari_ch_common_dir}PXF/3.0.0/alerts.json                       	${ambari_en_common_dir}PXF/3.0.0/
\cp -f ${ambari_ch_common_dir}NIFI/1.0.0/alerts.json                          	${ambari_en_common_dir}NIFI/1.0.0/


\cp -f ${ambari_ch_host_dir}alert_disk_space.py 		${ambari_en_host_dir}
\cp -f ${ambari_ch_host_dir}alert_version_select.py 		${ambari_en_host_dir}
\cp -f ${ambari_ch_common_dir}SPARK2/2.0.0/package/scripts/alerts/alert_spark2_thrift_port.py    	${ambari_en_common_dir}SPARK2/2.0.0/package/scripts/alerts/
\cp -f ${ambari_ch_common_dir}SPARK2/2.0.0/package/scripts/alerts/alert_spark2_livy_port.py      	${ambari_en_common_dir}SPARK2/2.0.0/package/scripts/alerts/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/package/alerts/alert_datanode_unmounted_data_dir.py    	${ambari_en_common_dir}HDFS/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/package/alerts/alert_metrics_deviation.py      		${ambari_en_common_dir}HDFS/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/package/alerts/alert_upgrade_finalized.py      		${ambari_en_common_dir}HDFS/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/package/alerts/alert_ha_namenode_health.py      		${ambari_en_common_dir}HDFS/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/package/alerts/alert_checkpoint_time.py      		${ambari_en_common_dir}HDFS/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}OOZIE/4.0.0.2.0/package/alerts/alert_check_oozie_server.py      		${ambari_en_common_dir}OOZIE/4.0.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}SPARK/1.2.1/package/scripts/alerts/alert_spark_livy_port.py      		${ambari_en_common_dir}SPARK/1.2.1/package/scripts/alerts/
\cp -f ${ambari_ch_common_dir}SPARK/1.2.1/package/scripts/alerts/alert_spark_thrift_port.py      	${ambari_en_common_dir}SPARK/1.2.1/package/scripts/alerts/
\cp -f ${ambari_ch_common_dir}AMBARI_METRICS/0.1.0/package/alerts/alert_ambari_metrics_monitor.py   	${ambari_en_common_dir}AMBARI_METRICS/0.1.0/package/alerts/
\cp -f ${ambari_ch_common_dir}FLUME/1.4.0.2.0/package/alerts/alert_flume_agent_status.py      		${ambari_en_common_dir}FLUME/1.4.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}YARN/2.1.0.2.0/package/alerts/alert_nodemanager_health.py      		${ambari_en_common_dir}YARN/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}YARN/2.1.0.2.0/package/alerts/alert_nodemanagers_summary.py      		${ambari_en_common_dir}YARN/2.1.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}RANGER/0.4.0/package/alerts/alert_ranger_admin_passwd_check.py      	${ambari_en_common_dir}RANGER/0.4.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HIVE/0.12.0.2.0/package/alerts/alert_llap_app_status.py      		${ambari_en_common_dir}HIVE/0.12.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HIVE/0.12.0.2.0/package/alerts/alert_hive_thrift_port.py      		${ambari_en_common_dir}HIVE/0.12.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HIVE/0.12.0.2.0/package/alerts/alert_hive_interactive_thrift_port.py  	${ambari_en_common_dir}HIVE/0.12.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HIVE/0.12.0.2.0/package/alerts/alert_hive_metastore.py      		${ambari_en_common_dir}HIVE/0.12.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HIVE/0.12.0.2.0/package/alerts/alert_webhcat_server.py      		${ambari_en_common_dir}HIVE/0.12.0.2.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HAWQ/2.0.0/package/alerts/alert_component_status.py                       ${ambari_en_common_dir}HAWQ/2.0.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HAWQ/2.0.0/package/alerts/alert_segment_registration_status.py            ${ambari_en_common_dir}HAWQ/2.0.0/package/alerts/
\cp -f ${ambari_ch_common_dir}HAWQ/2.0.0/package/alerts/alert_sync_status.py                            ${ambari_en_common_dir}HAWQ/2.0.0/package/alerts/
\cp -f ${ambari_ch_common_dir}PXF/3.0.0/package/alerts/api_status.py                            	${ambari_en_common_dir}PXF/3.0.0/package/alerts/
\cp -f ${ambari_ch_common_dir}NIFI/1.0.0/package/scripts/alert_check_nifi.py                            ${ambari_en_common_dir}NIFI/1.0.0/package/scripts/
