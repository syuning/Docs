# Docker 命令参考书

> 源文档网址：https://docs.docker.com/engine/reference/builder/

* **Docker**可以通过阅读**Dockerfile**中的指令来自动构建一个**镜像**
* **Dockerfile**是一个文本文档，其中包含用户可以在命令行上调用，以构建镜像的所有命令
* 通过使用 ```docker build``` 命令，用户可以构建一个镜像，并在构建成功后连续执行多个命令行指令

## Usage 用法

```docker build``` 命令根据 **Dockerfile** 的内容和 **语境(Context)** 来构建镜像，构建的语境可以是指定位置的 **路径(PATH)** 或 **(链接URL)**，其中 **路径(PATH)** 是本地文件系统上的目录，该而 **(链接URL)** 是一个Git仓库的地址。

 **语境(Context)** 是递归处理的，因此， **路径(PATH)** 包括该路径下的所有子目录，**(链接URL)** 包括该存储库及其所有子模块。以下示例展示了一个使用 **当前目录** 作为语境的构建命令：

```
$ docker build .
Sending build context to Docker daemon  6.51 MB
...
```

构建是由Docker进程，而不是CLI运行的，因此构建过程中要做的第一件事就是将整个语境（递归地）发送到Docker进程。在大多数情况下，最好使用空目录作为语境，并将Dockerfile保留在该目录中，之后依次添加构建Dockerfile所需的文件。

> 警告：不要将Dockerfile放在你的根目录将/作为PATH，因为它会试图将您硬盘驱动器中的全部内容传输到Docker进程！

Dockerfile使用指定的文件和指令（例如COPY指令）来在构建语境中使用文件。通过创建.dockerignore文件并添加到语境目录，可以排除语境目录下不需要用到的文件和目录，以提高构建性能。有关如何创建.dockerignore 文件的信息，请参阅 https://docs.docker.com/engine/reference/builder/#dockerignore-file。

默认情况下，Dockerfile的命名即“Dockerfile”，并位于语境目录的根目录中。您可以在docker build命令中使用-f选项来指向文件系统中位于任何位置的Dockerfile：

```
$ docker build -f /path/to/a/Dockerfile .
```

如果构建成功，则可以指定一个存储库(repository)和标签(tag)，用于存储新镜像：

```
$ docker build -t shykes/myapp .
```

要在构建后将镜像标记到多个存储库中，请在运行build命令时添加多个-t参数：

```
$ docker build -t shykes/myapp:1.0.2 -t shykes/myapp:latest .
```

在执行Dockerfile中的指令之前，Docker进程会对其进行初步验证。若Dockerfile的语法不正确，则返回错误：

```
$ docker build -t test/myapp .
Sending build context to Docker daemon 2.048 kB
Error response from daemon: Unknown instruction: RUNCMD
```

Docker进程将一一地执行Dockerfile中的指令，如有必要，每执行完一个指令都将结果提交到一个（中间的）新镜像，并在生成最终镜像时输出镜像的ID，之后Docker进程将自动清理您发送的语境。

请注意，每条指令都是相互独立执行，并将创建一个新镜像，因此 ```RUN cd /tmp``` 对下一条指令不会产生任何影响。

为了加速整个docker build构建过程，Docker将尽可能重复利用中间镜像（缓存），当控制台输出中Using cache消息指示时代表中间镜像被二次利用来生成新镜像。（有关更多信息，请参见 https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#build-cache）：

```
$ docker build -t svendowideit/ambassador .
Sending build context to Docker daemon 15.36 kB
Step 1/4 : FROM alpine:3.2
 ---> 31f630c65071
Step 2/4 : MAINTAINER SvenDowideit@home.org.au
 ---> Using cache
 ---> 2a1c91448f5f
Step 3/4 : RUN apk update &&      apk add socat &&        rm -r /var/cache/
 ---> Using cache
 ---> 21ed6e7fbb73
Step 4/4 : CMD env | grep _TCP= | (sed 's/.*_PORT_\([0-9]*\)_TCP=tcp:\/\/\(.*\):\(.*\)/socat -t 100000000 TCP4-LISTEN:\1,fork,reuseaddr TCP4:\2:\3 \&/' && echo wait) | sh
 ---> Using cache
 ---> 7ea8aef582cc
Successfully built 7ea8aef582cc
```

构建缓存仅用于具有本地父链的镜像，这意味着这些镜像是由以前的版本创建的，或者整个镜像链都由已加载docker load。如果您希望使用特定镜像的构建缓存，则可以使用--cache-from选项指定它。带 --cache-from的镜像不需要具有父链，可以从其他注册表(registry)中提取。

完成构建后，就可以考虑将存储库推送到其注册表(https://docs.docker.com/engine/tutorials/dockerrepos/#/contributing-to-docker-hub)了。

## BuildKit

从版本18.09开始，Docker支持由[moby/buildkit](https://github.com/moby/buildkit)项目提供的用于执行构建的新后端。

与旧的实现相比，BuildKit后端提供了许多好处：

* 检测并跳过执行未使用的构建阶段
* 并行构建独立构建阶段
* 两次构建之间仅增量传输构建上下文中的更改文件
* 在构建上下文中检测并跳过传输未使用的文件
* 使用具有许多新功能的外部Dockerfile实现
* 避免其他API的副作用（中间镜像和容器）
* 优先考虑构建缓存以进行自动修剪
* 要使用BuildKit后端，您需要在CLI上设置环境变量DOCKER_BUILDKIT=1，然后再调用docker build。

要了解基于BuildKit的构建可用的实验性Dockerfile语法，请参阅[BuildKit存储库中的文档](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/experimental.md)。

## Format 格式

这是Dockerfile的格式：

    # Comment
    INSTRUCTION arguments

该指令不区分大小写，但约定大写可以更轻松地将它们与参数区分开。

Docker Dockerfile 是按顺序运行指令的，一个 Dockerfile 必须以 `FROM` 指令开始，这可能在解析器指令parser directives、注释comments和全局范围的 `ARG` 之后。

`FROM` 指令指定要从中构建的父镜像，该指令只能在一个或多个 `ARG` 指令之前，这些 `ARG` 指令声明在 Dockerfile 的 `FROM` 行中使用的参数。

除非以#为开头的行是一个有效的解析器指令，否则Docker将它看作注释。若#处在一行中其他任何地方，该部分都只会被视为参数。例：

    # Comment
    RUN echo 'we are running some # of cool things'

注释中不支持换行符。

## Parser directives 解析器指令

解析器指令是可选的，并且会影响Dockerfile处理a 中后续行的方式。解析器指令不会在构建中添加图层，也不会显示为构建步骤。解析器指令以形式写为特殊类型的注释# directive=value。单个指令只能使用一次。

处理完注释，空行或生成器指令后，Docker不再寻找解析器指令。而是将格式化为解析器指令的任何内容都视为注释，并且不会尝试验证它是否可能是解析器指令。因此，所有解析器指令必须位于的顶部Dockerfile。

解析器指令不区分大小写。但是，约定是小写的。约定还应在任何解析器指令之后包含一个空白行。解析器伪指令不支持行继续字符。

由于这些规则，以下示例均无效：

由于行继续而无效：

    # direc \
    tive=value

由于出现两次而无效：

    # directive=value1
    # directive=value2
    FROM ImageName

由于出现在构建器指令之后而被视为注释：

    FROM ImageName
    # directive=value

由于出现在不是解析器指令的注释之后，因此被视为注释：

    # About my dockerfile
    # directive=value
    FROM ImageName

由于未被识别，未知指令被视为注释。另外，由于在非语法分析器指令的注释之后出现，因此已知指令被视为注释。

    # unknowndirective=value
    # knowndirective=value

解析器指令中允许非换行空格。因此，以下各行都被相同地对待：

    #directive=value
    # directive =value
    #	directive= value
    # directive = value
    #	  dIrEcTiVe=value

支持以下解析器指令：

* syntax
* escape

## syntax 语法

### Official releases

## escape

## Environment replacement

## .dockerignore file

## FROM

### Understand how ARG and FROM interact

## RUN

### Known issues (RUN)

## CMD

## LABEL

## MAINTAINER (deprecated)

## EXPOSE

## ENV

## ADD

## COPY

## ENTRYPOINT

### Exec form ENTRYPOINT example

### Shell form ENTRYPOINT example

### Understand how CMD and ENTRYPOINT interact

## VOLUME

### Notes about specifying volumes

## USER

## WORKDIR

## ARG

### Default values

### Scope

### Using ARG variables

### Predefined ARGs

### Automatic platform ARGs in the global scope

### Impact on build caching

## ONBUILD

## STOPSIGNAL

## HEALTHCHECK

## SHELL

## External implementation features

## Dockerfile examples
