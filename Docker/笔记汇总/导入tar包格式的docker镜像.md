# 导入tar包格式的docker镜像

提前安装、配置好Docker

1. 导入tar格式镜像包

    ```docker import /path/to/ambari-2.7.4.tar```

2. 查看已导入的镜像的镜像ID

    ```docker images```

3. 给当前镜像打tag（其中0e5574283393为镜像ID）

    ```docker tag 0e5574283393 registry.icp.com:5000/bigdata/ambari-cmp-env:2.7.4.0.0```

4. 以这个镜像运行一个容器

    ```docker run -i -t -v  /path/to/host-machine/maven-repo:/path/to/docker-image/maven-repo registry.icp.com:5000/bigdata/ambari-cmp-env:2.7.4.0.0 /bin/bash```