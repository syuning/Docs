# docker笔记

docker build -t docker-images/ambari-cmp-env:2.7.4.0.0 . (构建镜像)
docker run -it -v /usr/local/maven-repo:/root/.m2/repository docker-images/ambari-cmp-env:2.7.4.0.0 bash
docker run -it docker-images/ambari-cmp-env:2.7.4.0.0 bash (开启一个容器)
docker ps (查看容器id) # CONTAINER ID: 966a5416617d
docker exec -it 966a5416617d bash (运行容器，可以exit退出)
git pull
export NODE_HOME='/opt/node-v12.13.1'
export PATH=$NODE_HOME/bin:$PATH



文档 mvn -B -X install package rpm:rpm -DnewVersion=2.7.4.0.0 -DskipTests -Dbuild-rpm -Dpython.ver="python >= 2.6" -Drat.skip=true
官网 mvn -B -X clean install rpm:rpm -Drat.skip=true -DnewVersion=2.7.4.0.0 -DbuildNumber=b730f30585dd67c10d3b841317100f17d4b2c5f1 -DskipTests -Dpython.ver="python >= 2.6"

metrics模块需要单独编译 
mvn clean package -Dbuild-rpm -DskipTests -Drat.skip=true

示例 - Docker构建镜像的过程
1. Clone - 克隆示例代码: git clone https://github.com/docker/doodle.git
2. Build - 构建镜像: cd doodle/cheers2019 && docker build -t syuning/cheers2019 .
3. Run - 运行镜像: docker run -it --rm syuning/cheers2019
4. Ship - 将构建好的镜像推至云端: docker login && docker push syuning/cheers2019
docker images (查看当前所有镜像)
docker pull docker-images/ambari-cmp-env:2.7.4.0.0 (拉取镜像)




找不到包
org.apache.phoenix:phoenix-core:jar:5.0.0.3.1.4.0-272, org.apache.hadoop:hadoop-common:jar:3.1.1.3.1.4.0-272, org.apache.hadoop:hadoop-annotations:jar:3.1.1.3.1.4.0-272, org.apache.hadoop:hadoop-common:jar:tests:3.1.1.3.1.4.0-272, org.apache.hadoop:hadoop-yarn-common:jar:tests:3.1.1.3.1.4.0-272, org.apache.hadoop:hadoop-yarn-common:jar:3.1.1.3.1.4.0-272, org.apache.hadoop:hadoop-yarn-api:jar:3.1.1.3.1.4.0-272, org.apache.hadoop:hadoop-yarn-server-common:jar:3.1.1.3.1.4.0-272, org.apache.phoenix:phoenix-core:jar:tests:5.0.0.3.1.4.0-272, org.apache.hbase:hbase-it:jar:tests:2.0.2.3.1.4.0-272, org.apache.hbase:hbase-testing-util:jar:2.0.2.3.1.4.0-272

解决方法：
mvn install:install-file -Dfile=phoenix-core-4.7.0.2.6.5.172-4.pom -DgroupId=org.apache.phoenix -DartifactId=phoenix-core -Dversion=4.7.0.2.6.5.172-4 -Dpackaging=jar

Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/phoenix/phoenix-core/5.0.0.3.1.4.0-272/phoenix-core-5.0.0.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/phoenix/phoenix-core/5.0.0.3.1.4.0-272/phoenix-core-5.0.0.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/phoenix/phoenix-core/5.0.0.3.1.4.0-272/phoenix-core-5.0.0.3.1.4.0-272.pom

Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hadoop/hadoop-common/3.1.1.3.1.4.0-272/hadoop-common-3.1.1.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hadoop/hadoop-common/3.1.1.3.1.4.0-272/hadoop-common-3.1.1.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hadoop/hadoop-common/3.1.1.3.1.4.0-272/hadoop-common-3.1.1.3.1.4.0-272.pom

Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hadoop/hadoop-annotations/3.1.1.3.1.4.0-272/hadoop-annotations-3.1.1.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hadoop/hadoop-annotations/3.1.1.3.1.4.0-272/hadoop-annotations-3.1.1.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hadoop/hadoop-annotations/3.1.1.3.1.4.0-272/hadoop-annotations-3.1.1.3.1.4.0-272.pom
[WARNING] The POM for org.apache.hadoop:hadoop-annotations:jar:3.1.1.3.1.4.0-272 is missing, no dependency information available

Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hadoop/hadoop-yarn-common/3.1.1.3.1.4.0-272/hadoop-yarn-common-3.1.1.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hadoop/hadoop-yarn-common/3.1.1.3.1.4.0-272/hadoop-yarn-common-3.1.1.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hadoop/hadoop-yarn-common/3.1.1.3.1.4.0-272/hadoop-yarn-common-3.1.1.3.1.4.0-272.pom
Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hadoop/hadoop-yarn-api/3.1.1.3.1.4.0-272/hadoop-yarn-api-3.1.1.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hadoop/hadoop-yarn-api/3.1.1.3.1.4.0-272/hadoop-yarn-api-3.1.1.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hadoop/hadoop-yarn-api/3.1.1.3.1.4.0-272/hadoop-yarn-api-3.1.1.3.1.4.0-272.pom
Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hadoop/hadoop-yarn-server-common/3.1.1.3.1.4.0-272/hadoop-yarn-server-common-3.1.1.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hadoop/hadoop-yarn-server-common/3.1.1.3.1.4.0-272/hadoop-yarn-server-common-3.1.1.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hadoop/hadoop-yarn-server-common/3.1.1.3.1.4.0-272/hadoop-yarn-server-common-3.1.1.3.1.4.0-272.pom
[WARNING] The POM for org.apache.hadoop:hadoop-yarn-server-common:jar:3.1.1.3.1.4.0-272 is missing, no dependency information available
Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hbase/hbase-it/2.0.2.3.1.4.0-272/hbase-it-2.0.2.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hbase/hbase-it/2.0.2.3.1.4.0-272/hbase-it-2.0.2.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hbase/hbase-it/2.0.2.3.1.4.0-272/hbase-it-2.0.2.3.1.4.0-272.pom
[WARNING] The POM for org.apache.hbase:hbase-it:jar:tests:2.0.2.3.1.4.0-272 is missing, no dependency information available
Downloading from apache-hadoop: https://repo.hortonworks.com/content/groups/public/org/apache/hbase/hbase-testing-util/2.0.2.3.1.4.0-272/hbase-testing-util-2.0.2.3.1.4.0-272.pom
Downloading from apache-snapshots: https://repository.apache.org/content/repositories/snapshots/org/apache/hbase/hbase-testing-util/2.0.2.3.1.4.0-272/hbase-testing-util-2.0.2.3.1.4.0-272.pom
Downloading from aliyuncentral: https://maven.aliyun.com/repository/central/org/apache/hbase/hbase-testing-util/2.0.2.3.1.4.0-272/hbase-testing-util-2.0.2.3.1.4.0-272.pom
