#!/bin/bash
ambari_en_stack_dir="/opt/mnt/ambari-release-2.7.1/ambari-server/src/main/resources/stacks/HDP/"
ambari_en_common_dir="/opt/mnt/ambari-release-2.7.1/ambari-server/src/main/resources/common-services/"
ambari_ch_stack_dir="/home/zhoudong/change2ch-4.0/widgets/ambari-server/src/main/resources/stacks/HDP/"
ambari_ch_common_dir="/home/zhoudong/change2ch-4.0/widgets/ambari-server/src/main/resources/common-services/"

\cp -f ${ambari_ch_stack_dir}2.3/services/HDFS/widgets.json 		${ambari_en_stack_dir}2.3/services/HDFS/
\cp -f ${ambari_ch_stack_dir}2.3/services/YARN/YARN_widgets.json 	${ambari_en_stack_dir}2.3/services/YARN/
\cp -f ${ambari_ch_stack_dir}2.3/services/HBASE/widgets.json 	 	${ambari_en_stack_dir}2.3/services/HBASE/
\cp -f ${ambari_ch_stack_dir}2.0.6/widgets.json			 	${ambari_en_stack_dir}2.0.6/
\cp -f ${ambari_ch_common_dir}HDFS/2.1.0.2.0/widgets.json	 	${ambari_en_common_dir}HDFS/2.1.0.2.0/
\cp -f ${ambari_ch_common_dir}STORM/0.10.0/widgets.json 	 	${ambari_en_common_dir}STORM/0.10.0/
\cp -f ${ambari_ch_common_dir}YARN/2.1.0.2.0/YARN_widgets.json 	 	${ambari_en_common_dir}YARN/2.1.0.2.0/
\cp -f ${ambari_ch_common_dir}HBASE/0.96.0.2.0/widgets.json 		${ambari_en_common_dir}HBASE/0.96.0.2.0/
\cp -f ${ambari_ch_common_dir}KAFKA/0.9.0/widgets.json 			${ambari_en_common_dir}KAFKA/0.9.0/
\cp -f ${ambari_ch_common_dir}HAWQ/2.0.0/widgets.json                 	${ambari_en_common_dir}HAWQ/2.0.0/
\cp -f ${ambari_ch_common_dir}NIFI/1.0.0/widgets.json                   ${ambari_en_common_dir}NIFI/1.0.0/
