@贝蒂:unicorn:的文档
> 官方文档地址：https://docs.docker.com/engine/reference/commandline/docker/

# docker cli 中的基本命令

命令 | 描述
--- | ---
docker attach | 将本地标准输入、输出和错误流附加到正在运行的容器
docker build | 从Dockerfile构建镜像
docker builder | 管理构建
docker checkpoint | 管理检查点
docker commit | 根据容器的更改创建新镜像
docker config | 管理Docker配置
docker container | 管理容器
docker context | 管理上下文
docker cp | 在容器和本地文件系统之间复制文件/文件夹
docker create | 创建一个新的容器
docker diff | 检查容器文件系统上文件或目录的更改
docker events | 从服务器获取实时事件
docker exec | 在正在运行的容器中运行命令
docker export | 将容器的文件系统导出为tar存档
docker history | 显示镜像的历史记录
docker image | 管理图片
docker images | 列出图片
docker import | 从tarball导入内容以创建文件系统镜像
docker info | 显示系统范围的信息
docker inspect | 返回有关Docker对象的低级信息
docker kill | 杀死一个或多个正在运行的容器
docker load | 从tar存档或STDIN加载镜像
docker login | 登录
docker logout | 登出
docker logs | 提取容器的日志
docker manifest | 管理Docker镜像清单和清单列表
docker network | 管理网络
docker node | 管理Swarm节点
docker pause | 暂停一个或多个容器中的所有进程
docker plugin | 管理插件
docker port | 列出端口映射或容器的特定映射
docker ps | 列出容器
docker pull | 从registry中提取镜像或存储库
docker push | 将镜像或存储库推至registry
docker rename | 重命名容器
docker restart | 重新启动一个或多个容器
docker rm | 删除一个或多个容器
docker rmi | 删除一个或多个镜像
docker run | 在新容器中运行命令
docker save | 将一个或多个镜像保存到tar存档（默认情况下流式传输到STDOUT）
docker search | 在Docker Hub中搜索镜像
docker secret | 管理docker秘钥
docker service | 管理服务
docker stack | 管理Docker堆栈
docker start | 启动一个或多个已停止的容器
docker stats | 显示实时的容器资源使用情况统计流
docker stop | 停止一个或多个运行中的容器
docker swarm | 管理 Swarm
docker system | 管理 Docker
docker tag | 创建一个引用镜像SOURCE_IMAGE的标签 - ```TARGET_IMAGE```
docker top | 显示容器的运行进程
docker trust | 管理对 **Docker镜像** 的信任
docker unpause | 取消暂停一个或多个容器中的所有进程
docker update | 更新一个或多个容器的配置
docker version | 显示Docker版本信息
docker volume | 管理卷
docker wait | 阻塞直到一个或多个容器停止，然后打印其退出代码