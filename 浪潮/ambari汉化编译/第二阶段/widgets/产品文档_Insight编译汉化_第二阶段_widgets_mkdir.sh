#!/bin/bash
ambari_ch_stack_dir="ambari-server/src/main/resources/stacks/HDP/"
ambari_ch_common_dir="ambari-server/src/main/resources/common-services/"

mkdir -p ${ambari_ch_stack_dir}2.3/services/HDFS/
mkdir -p ${ambari_ch_stack_dir}2.3/services/YARN/
mkdir -p ${ambari_ch_stack_dir}2.3/services/HBASE/
mkdir -p ${ambari_ch_stack_dir}2.0.6/
mkdir -p ${ambari_ch_common_dir}HDFS/2.1.0.2.0/
mkdir -p ${ambari_ch_common_dir}STORM/0.10.0/
mkdir -p ${ambari_ch_common_dir}YARN/2.1.0.2.0/
mkdir -p ${ambari_ch_common_dir}HBASE/0.96.0.2.0/
mkdir -p ${ambari_ch_common_dir}KAFKA/0.9.0
mkdir -p ${ambari_ch_common_dir}HAWQ/2.0.0/
mkdir -p ${ambari_ch_common_dir}NIFI/1.0.0/
