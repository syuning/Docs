@贝蒂:unicorn:的文档
> 官方文档地址：https://docs.docker.com/engine/reference/commandline/build/
# **docker build**

docker build [OPTIONS] PATH | URL | -

# 常用选项

选项 | 描述
----- | -----
--add-host | 给镜像添加一个hosts文件
--ssh | ssh到构建（只有当启用BuildKit时可用，格式：default|[=|[,]]）
--file , -f | 用于构建镜像的dockerfile的名称
--memory , -m | 内存限制
--compress | 使用gzip压缩镜像内容
--force-rm | 总是删除中间容器
--iidfile | 将镜像ID写至文件
--output , -o | 输出路径（格式：type=local,dest=path）
--platform | 当服务器为多种平台时，设置平台
--pull | 总是尝试拉取最新版本的镜像