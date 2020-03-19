#!/bin/bash
ambari_en_dir="ambari-server/src/main/resources/"

native2ascii ${ambari_en_dir}common-services/HDFS/2.1.0.2.0/widgets.json ${ambari_en_dir}common-services/HDFS/2.1.0.2.0/widgets.json
native2ascii ${ambari_en_dir}common-services/YARN/2.1.0.2.0/YARN_widgets.json ${ambari_en_dir}common-services/YARN/2.1.0.2.0/YARN_widgets.json
native2ascii ${ambari_en_dir}common-services/HBASE/0.96.0.2.0/widgets.json ${ambari_en_dir}common-services/HBASE/0.96.0.2.0/widgets.json 
native2ascii ${ambari_en_dir}stacks/HDP/2.0.6/widgets.json ${ambari_en_dir}stacks/HDP/2.0.6/widgets.json 
native2ascii ${ambari_en_dir}stacks/HDP/2.3/services/HDFS/widgets.json ${ambari_en_dir}stacks/HDP/2.3/services/HDFS/widgets.json 
native2ascii ${ambari_en_dir}stacks/HDP/2.3/services/YARN/YARN_widgets.json ${ambari_en_dir}stacks/HDP/2.3/services/YARN/YARN_widgets.json 
native2ascii ${ambari_en_dir}stacks/HDP/2.3/services/HBASE/widgets.json ${ambari_en_dir}stacks/HDP/2.3/services/HBASE/widgets.json 
native2ascii ${ambari_en_dir}common-services/KAFKA/0.9.0/widgets.json ${ambari_en_dir}common-services/KAFKA/0.9.0/widgets.json 
native2ascii ${ambari_en_dir}common-services/STORM/0.10.0/widgets.json ${ambari_en_dir}common-services/STORM/0.10.0/widgets.json
native2ascii ${ambari_en_dir}common-services/HAWQ/2.0.0/widgets.json ${ambari_en_dir}common-services/HAWQ/2.0.0/widgets.json
native2ascii ${ambari_en_dir}common-services/NIFI/1.0.0/widgets.json ${ambari_en_dir}common-services/NIFI/1.0.0/widgets.json
