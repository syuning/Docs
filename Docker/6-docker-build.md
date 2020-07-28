@贝蒂:unicorn:的文档
> 官方文档地址：https://docs.docker.com/engine/reference/commandline/build/
# **docker build**

## 1 **说明**

从Dockerfile构建镜像。

## 2 **用法**

docker build [OPTIONS] PATH | URL | -

## 3 **扩展说明**

```docker build``` 命令根据 **Dockerfile** 和 **“上下文（context）”** 来构建Docker镜像，构建的 **上下文** 指的是位于指定**PATH**或**URL**中的文件集。构建过程可以引用上下文中的任何文件，例如您的构建可以使用 ```COPY``` 指令在上下文中引用文件。

该 **URL参数** 可以引用三种资源：***Git存储库***，***预打包的tarball上下文***和***纯文本文件***。

### **3.1 Git仓库**

当URL参数指向Git存储库的位置时，该存储库将被作为构建的上下文。系统以递归方式获取存储库及其子模块，但提交历史记录将不会被保留。首先将存储库拉到本地主机上的临时目录中，成功之后，该目录将作为上下文发送到Docker守护程序。本地副本使您能够使用本地用户凭据、VPN等访问私有存储库。

> 注意：如果URL参数包含一个片段，则系统将使用 git clone --recursive 命令递归克隆存储库及其子模块。

**Git URL** 在其片段部分接受上下文配置，并用冒号（:）分隔。第一部分代表 ```Git``` 将 check out 的引用，可以是分支、标签或远程引用；第二部分表示存储库中的子目录，该子目录将用作构建上下文。

例如，运行以下命令以使用docker分支中 称为的目录container：

    $ docker build https://github.com/docker/rootfs.git#container:docker

下表表示所有有效的后缀及其构建上下文：

构建语法后缀 | 提交使用 | 使用的构建上下文
------- | ------- | -------
myrepo.git | refs/heads/master | /
myrepo.git#mytag | refs/tags/mytag | /
myrepo.git#mybranch | refs/heads/mybranch | /
myrepo.git#pull/42/head | refs/pull/42/head | /
myrepo.git#:myfolder | refs/heads/master | /myfolder
myrepo.git#master:myfolder | refs/heads/master | /myfolder
myrepo.git#mytag:myfolder | refs/tags/mytag | /myfolder
myrepo.git#mybranch:myfolder | refs/heads/mybranch | /myfolder

### **3.2 Tarball 上下文**

如果将URL传递到远程tarball，则URL本身将被发送到守护程序：

    $ docker build http://server/context.tar.gz

下载操作将在运行 **Docker守护程序的主机** 上执行，该主机不一定与发出 ```build``` 命令的主机相同。

**Docker守护程序** 将获取 ```context.tar.gz``` 并将其用作构建上下文，Tarball上下文必须是符合 ```tar``` UNIX格式标准的tar压缩文件， 并且可以使用“ xz”，“ bzip2”，“ gzip”或“identity”（无压缩）格式中的任何一种进行压缩。

### **3.3 文本文件**

除了指定一个上下文，你还可以通过 ```STDIN``` 在 **URL** 或 **管道** 中传递一个 ```Dockerfile``` 。

要 pipe 一个来自来自 ```STDIN``` 的 ```Dockerfile``` ：

    $ docker build - < Dockerfile

使用Windows上的Powershell，您可以运行：

    Get-Content Dockerfile | docker build -

如果您使用 ```STDIN``` 或指定一个 ```URL``` 来指向一个 **纯文本文件** 时，则系统会将内容放入一个名为 ```Dockerfile``` 的文件，任何-f，--file 选项都将被忽略。在这种情况下，没有上下文。

默认情况下， ```docker build``` 命令将在构建上下文的根目录中查找 ```Dockerfile``` ，使用 ```-f```，```--file``` 选项可以指定替代文件的路径。在将同一组文件用于多个构建的情况下，这很有用，但该路径必须是构建上下文中的文件。如果指定了相对路径，则将其解释为相对于上下文的根。

在大多数情况下，最好将每个 ```Dockerfile``` 放在一个空目录中。然后，仅将构建 ```Dockerfile``` 所需的文件添加到该目录。为了提高构建的性能，您也可以通过 ```.dockerignore``` 向该目录添加文件来排除文件和目录。

如果 ***Docker客户端*** 失去与守护程序的连接，构建将被取消。如果您使用 ```CTRL-c``` 中断 ```Docker客户端```，或者由于任何原因 **Docker客户端** 被杀死，就会发生这种情况。如果该构建启动了拉取，而该拉取在取消构建时仍在运行，则拉取也将被取消。

有关此命令的示例用法，请参阅下面的示例部分。

## **4 选项**

名称，简写 | 默认 | 描述
----- | ----- | -----
--add-host |  | 添加自定义hosts文件（host：ip的映射）
--build-arg |  | 设置构建时变量
--cache-from |  | 作为缓存源的镜像
--cgroup-parent |  | 容器的可选父cgroup
--compress |  | 使用gzip压缩构建上下文
--cpu-period |  | 限制 CPU 的 CFS（完全公平调度程序）期限
--cpu-quota |  | 限制 CPU 的 CFS（完全公平的调度程序）配额
--cpu-shares , -c |  | CPU份额（相对比重）
--cpuset-cpus |  | 允许执行的CPU（0-3，0,1）
--cpuset-mems |  | 允许执行的MEM（0-3，0,1）
--disable-content-trust |	true | 跳过镜像验证
--file , -f |  | Dockerfile的名称（默认为“PATH/Dockerfile”）
--force-rm |  | 始终清除中间容器
--iidfile |  | 将镜像ID写入文件
--isolation |  | 容器隔离技术
--label |  | 设置镜像的元数据
--memory , -m |  | 内存限制
--memory-swap |  | 交换限制等于内存加交换：“-1”，以启用无限交换
--network |  | （API 1.25以上 在构建过程中为RUN指令设置网络模式
--no-cache |  | 构建镜像时不要使用缓存
--output , -o |  | （API 1.40+） 输出目的地（格式：type = local，dest = path）
--platform |  | （API 1.38以上） 如果服务器支持多平台，则设置平台
--progress | auto | 设置进度输出的类型（auto, plain, tty）。使用 **plain** 显示容器输出
--pull |  | 始终尝试拉取镜像的较新版本
--quiet , -q |  | 禁止生成输出并在成功时打印镜像ID
--rm | true | 成功构建后删除中间容器
--secret |  | （API 1.39以上，仅在启用BuildKit的情况下可用）公开给构建的秘钥文件：id = mysecret，src = /local/secret
--security-opt |  | 安全选项
--shm-size | /dev/shm 的大小
--squash |  | （实验（守护程序））（API 1.25以上）将新构建的层压缩为一个新层
--ssh |  | （API 1.39以上）将SSH代理socket或密钥公开给构建（仅在启用BuildKit的情况下）（格式：default |[=|[，]]）
--stream |  | （实验（守护程序））（API 1.31以上） 流附加到服务器以制定构建上下文
--tag , -t |  | 名称以及“name：tag”格式的标签（可选）
--target |  | 设置要构建的目标构建阶段。
--ulimit |  | Ulimit选项

## **5 例子**

### 5.1 **使用PATH构建**
 
    $ docker build .
    
    Uploading context 10240 bytes
    Step 1/3 : FROM busybox
    Pulling repository busybox
     ---> e9aa60c60128MB/2.284 MB (100%) endpoint: https://cdn-registry-1.docker.io/v1/
    Step 2/3 : RUN ls -lh /
     ---> Running in 9c9e81692ae9
    total 24
    drwxr-xr-x    2 root     root        4.0K Mar 12  2013 bin
    drwxr-xr-x    5 root     root        4.0K Oct 19 00:19 dev
    drwxr-xr-x    2 root     root        4.0K Oct 19 00:19 etc
    drwxr-xr-x    2 root     root        4.0K Nov 15 23:34 lib
    lrwxrwxrwx    1 root     root           3 Mar 12  2013 lib64 -> lib
    dr-xr-xr-x  116 root     root           0 Nov 15 23:34 proc
    lrwxrwxrwx    1 root     root           3 Mar 12  2013 sbin -> bin
    dr-xr-xr-x   13 root     root           0 Nov 15 23:34 sys
    drwxr-xr-x    2 root     root        4.0K Mar 12  2013 tmp
    drwxr-xr-x    2 root     root        4.0K Nov 15 23:34 usr
     ---> b35f4035db3f
    Step 3/3 : CMD echo Hello world
     ---> Running in 02071fceb21b
     ---> f52f38b7823e
    Successfully built f52f38b7823e
    Removing intermediate container 9c9e81692ae9
    Removing intermediate container 02071fceb21b

本示例指定的 ```PATH``` 是 .，因此本地目录中的所有文件都为 ```tar``` 并将其发送到 **Docker守护程序**。该 ```PATH``` 指定在哪里可以找到文件上的 **docker守护程序** 生成的“背景”。请记住，该守护程序可能正在远程计算机上运行，​​并且在客户端（您正在运行的客户端）没有对Dockerfile进行解析 docker build。这意味着将发送所有文件PATH，而不仅仅是Dockerfile中列为ADD的文件。

docker当您看到“正在发送构建上下文”消息时，客户端将上下文从本地计算机转移到Docker守护程序 。

如果希望在构建完成后保留中间容器，则必须使用--rm=false。这不会影响生成缓存。

### 5.2 **使用URL构建**

    $ docker build github.com/creack/docker-firefox

这将克隆GitHub存储库，并将克隆的存储库用作上下文。存储库根目录中的Dockerfile用作Dockerfile。您可以使用git://或git@方案指定任意的Git存储库。

    $ docker build -f ctx/Dockerfile http://server/ctx.tar.gz
    
    Downloading context: http://server/ctx.tar.gz [===================>]    240 B/240 B
    Step 1/3 : FROM busybox
     ---> 8c2e06607696
    Step 2/3 : ADD ctx/container.cfg /
     ---> e7829950cee3
    Removing intermediate container b35224abf821
    Step 3/3 : CMD /bin/ls
     ---> Running in fbc63d321d73
     ---> 3286931702ad
    Removing intermediate container fbc63d321d73
    Successfully built 377c409b35e4

这会将URL发送http://server/ctx.tar.gz到Docker守护程序，后者下载并提取引用的tarball。所述-f ctx/Dockerfile 参数指定内部的路径ctx.tar.gz的Dockerfile，用于构建镜像。其中的任何引用本地路径的ADD命令都Dockerfile必须相对于内部内容的根ctx.tar.gz。在上面的示例中，压缩包包含一个目录ctx/，因此该ADD ctx/container.cfg /操作按预期进行。

### 5.3 **使用-** 

    $ docker build - < Dockerfile

这将从STDIN上下文中读取Dockerfile 。由于缺少上下文，因此不会将任何本地目录的内容发送到Docker守护程序。由于没有上下文，因此Dockerfile ADD仅在引用远程URL时才起作用。

    $ docker build - < context.tar.gz

这将为从中读取的压缩上下文构建镜像STDIN。支持的格式有：bzip2，gzip和xz。

### 5.4 **使用.dockerignore文件**

    $ docker build .
    
    Uploading context 18.829 MB
    Uploading context
    Step 1/2 : FROM busybox
     ---> 769b9341d937
    Step 2/2 : CMD echo Hello world
     ---> Using cache
     ---> 99cc1ad10469
    Successfully built 99cc1ad10469
    $ echo ".git" > .dockerignore
    $ docker build .
    Uploading context  6.76 MB
    Uploading context
    Step 1/2 : FROM busybox
     ---> 769b9341d937
    Step 2/2 : CMD echo Hello world
     ---> Using cache
     ---> 99cc1ad10469
    Successfully built 99cc1ad10469

本示例说明了如何使用.dockerignore文件.git 从上下文中排除目录。从上载上下文的更改大小可以看出其效果。构建器参考包含有关创建.dockerignore文件的详细信息 。

使用BuildKit后端时，docker build搜索.dockerignore相对于Dockerfile名称的文件。例如，运行 docker build -f myapp.Dockerfile .将首先查找名为的忽略文件 myapp.Dockerfile.dockerignore。如果找不到这样的文件，.dockerignore 则使用该文件（如果存在）。.dockerignore如果项目包含多个Dockerfile且期望忽略不同的文件集，则使用基于Dockerfile 很有用。

### 5.5 **标记一个镜像标签（-t）**

    $ docker build -t vieux/apache:2.0 .

它将像前面的示例一样构建，但是它将标记生成的镜像。存储库名称为vieux/apache，标签为2.0。 详细了解有效标签。

您可以将多个标签应用于镜像。例如，您可以将latest 标签应用于新建的镜像，并添加另一个引用特定版本的标签。例如，要将镜像同时标记为whenry/fedora-jboss:latest和 whenry/fedora-jboss:v2.1，请使用以下命令：

    $ docker build -t whenry/fedora-jboss:latest -t whenry/fedora-jboss:v2.1 .

### 5.6 **指定一个Dockerfile（-f）**

    $ docker build -f Dockerfile.debug .

这将使用一个Dockerfile.debug用于生成说明的文件代替Dockerfile。

    $ curl example.com/remote/Dockerfile | docker build -f - .

上面的命令将使用当前目录作为构建上下文，并从stdin中读取Dockerfile。

    $ docker build -f dockerfiles/Dockerfile.debug -t myapp_debug .
    $ docker build -f dockerfiles/Dockerfile.prod  -t myapp_prod .

上面的命令将.两次构建当前的构建上下文（如所指定 ），一次使用a的调试版本，Dockerfile一次使用生产版本。

    $ cd /home/me/myapp/some/dir/really/deep
    $ docker build -f /home/me/myapp/dockerfiles/debug /home/me/myapp
    $ docker build -f ../../../../dockerfiles/debug /home/me/myapp

这两个docker build命令完全相同。它们都使用debug文件的内容而不是查找a，Dockerfile并且将 /home/me/myapp用作构建上下文的根。请注意debug，无论您在命令行中如何引用它，它都位于构建上下文的目录结构中。

注意： 如果文件或目录在上载的上下文中不存在，docker build将返回no such file or directory错误。如果没有上下文，或者您指定了主机系统上其他位置的文件，则可能会发生这种情况。出于安全原因，上下文仅限于当前目录（及其子目录），并确保在远程Docker主机上可重复的构建。这也是为什么ADD ../file不起作用的原因 。

### 5.7 **使用自定义父级cgroup（--cgroup-parent）**

当docker build使用--cgroup-parent选项运行时，将使用相应的docker run 标志运行构建中使用的容器。

### 5.8 **在容器中设置ulimit（--ulimit）**

与--ulimit选项一起使用docker build将使每个构建步骤的容器使用这些--ulimit 标志值启动。

### 5.9 **设置构建时变量（--build-arg）**

您可以使用ENVDockerfile中的指令来定义变量值。这些值将保留在生成的镜像中。但是，持久性通常不是您想要的。用户希望根据构建镜像的主机不同地指定变量。

一个很好的例子是http_proxy拉中间文件的源版本。该ARG指令使Dockerfile作者可以使用--build-arg标志定义用户可以在构建时设置的值 ：

    $ docker build --build-arg HTTP_PROXY=http://10.20.30.2:1234 --build-arg FTP_PROXY=http://40.50.60.5:4567 .

此标志允许您传递RUN在Dockerfile指令中像常规环境变量一样访问的构建时变量。同样，这些值不会像中间值那样保留在中间或最终镜像中ENV。您必须--build-arg为每个构建参数添加。

ARG在构建过程中回显Dockerfile中的行时，使用此标志不会更改您看到的输出。

有关使用ARG和ENV说明的详细信息，请参阅 Dockerfile参考。

您也可以使用--build-arg不带值的标志，在这种情况下，本地环境中的值将传播到正在构建的Docker容器中：

    $ export HTTP_PROXY=http://10.20.30.2:1234
    $ docker build --build-arg HTTP_PROXY .

这类似于docker run -e工作原理。请参阅docker run文档 以获取更多信息。

### 5.10 **可选的安全选项（--security-opt）**

仅在Windows上运行的守护程序支持此标志，并且仅支持该credentialspec选项。在credentialspec必须在格式 file://spec.txt或registry://keyname。

### 5.11 **指定容器的隔离技术（-isolation）**

在Windows上运行Docker容器的情况下，此选项很有用。该--isolation=<value>选项设置了容器的隔离技术。在Linux上，唯一受支持的default选项是使用Linux名称空间的选项。在Microsoft Windows上，您可以指定以下值：

值 | 描述
-- | --
default | 使用Docker守护程序的指定的值--exec-opt。如果daemon未指定隔离技术，则Microsoft Windows将使用process其默认值。
process | 仅命名空间隔离。
hyperv | Hyper-V虚拟机管理程序基于分区的隔离。

指定--isolation不带值的标志与设置相同--isolation="default"。

### 5.12 **将条目添加到容器主机文件（--add-host）**

您可以/etc/hosts使用一个或多个--add-host标志将其他主机添加到容器的文件中。本示例为名为的主机添加静态地址 docker：

    $ docker build --add-host=docker:10.180.0.1 .

### 5.13 **指定目标构建阶段（--target）**

当构建具有多个构建阶段的Dockerfile时，--target可用于按名称指定中间构建阶段，作为生成镜像的最后阶段。目标阶段之后的命令将被跳过。
    
    FROM debian AS build-env
    ...
    
    FROM alpine AS production-env
    ...
    $ docker build -t mybuildimage --target build-env .

### 5.14 **自定义构建输出**

默认情况下，将从生成结果中创建本地容器镜像。该 --output（或-o）标志允许您覆盖这种行为，并且指定自定义的出口国。例如，自定义导出器允许您将构建工件导出为本地文件系统上的文件而不是Docker镜像，这对于生成本地二进制文件，代码生成等非常有用。

的值--output是CSV格式的字符串，用于定义导出器类型和选项。目前，local和tar出口的支持。该local 出口所产生的构建文件写入到客户端上的目录。该 tar出口国类似，但写入文件作为一个压缩包（.tar）。

如果未指定任何类型，则该值默认为本地导出器的输出目录。使用连字符（-）将输出tarball写入标准输出（STDOUT）。

以下示例使用当前目录（.）作为构建上下文来构建镜像，并将文件导出到out当前目录中命名的目录中。如果目录不存在，Docker会自动创建目录：

    $ docker build -o out .

上面的示例使用了简写语法，省略了type选项，因此使用了默认（local）导出器。下面的示例显示了使用长期CSV语法的等效项，同时指定了type和dest（目标路径）：

    $ docker build --output type=local,dest=out .

使用该tar类型将文件导出为.tar归档文件：

    $ docker build --output type=tar,dest=out.tar .

下面的示例显示了使用简写语法时的等效内容。在这种情况下，-指定为目标，目标将自动选择tar类型，并将输出tarball写入标准输出，然后将其重定向到out.tar文件：

    docker build -o - . > out.tar

该--output选项导出目标阶段中的所有文件。仅导出特定文件的常见模式是进行多阶段构建，然后使用将文件复制到新的暂存阶段COPY --from。

Dockerfile下面的示例使用一个单独的阶段来收集要导出的构建工件：

    FROM golang AS build-stage
    RUN go get -u github.com/LK4D4/vndr
    
    FROM scratch AS export-stage
    COPY --from=build-stage /go/bin/vndr /

使用该-o选项构建Dockerfile时，仅将最后阶段的文件导出到out目录，在本例中为vndr二进制文件：

    $ docker build -o out .
    
    [+] Building 2.3s (7/7) FINISHED
     => [internal] load build definition from Dockerfile                                                                          0.1s
     => => transferring dockerfile: 176B                                                                                          0.0s
     => [internal] load .dockerignore                                                                                             0.0s
     => => transferring context: 2B                                                                                               0.0s
     => [internal] load metadata for docker.io/library/golang:latest                                                              1.6s
     => [build-stage 1/2] FROM docker.io/library/golang@sha256:2df96417dca0561bf1027742dcc5b446a18957cd28eba6aa79269f23f1846d3f   0.0s
     => => resolve docker.io/library/golang@sha256:2df96417dca0561bf1027742dcc5b446a18957cd28eba6aa79269f23f1846d3f               0.0s
     => CACHED [build-stage 2/2] RUN go get -u github.com/LK4D4/vndr                                                              0.0s
     => [export-stage 1/1] COPY --from=build-stage /go/bin/vndr /                                                                 0.2s
     => exporting to client                                                                                                       0.4s
     => => copying files 10.30MB                                                                                                  0.3s
    
    $ ls ./out
    vndr

> 注意：此功能需要BuildKit后端。您可以 启用BuildKit或使用 提供更多输出类型选项的buildx插件。

### 5.15 **指定外部缓存源**

除了本地构建缓存之外，构建器还可以重用从先前构建生成的缓存，其中--cache-from标志指向注册表中的镜像。

要将镜像用作缓存源，需要在创建镜像时将缓存元数据写入镜像。这可以通过--build-arg BUILDKIT_INLINE_CACHE=1 在构建镜像时进行设置来完成。之后，可以将构建的镜像用作后续构建的缓存源。

导入缓存后，构建器将仅从注册表中提取JSON元数据，并根据该信息确定可能的缓存命中。如果存在缓存命中，则将匹配的图层拉入本地环境。

除了镜像之外，还可以从buildxBuildKit CLI（buildctl）生成的特殊缓存清单中提取缓存。这些清单（使用type=registry和mode=max 选项构建时）可为多阶段构建中的中间阶段提取层数据。

以下示例使用内联缓存元数据构建镜像，并将其推送到注册表，然后将该镜像用作另一台计算机上的缓存源：

    $ docker build -t myname/myapp --build-arg BUILDKIT_INLINE_CACHE=1 .
    $ docker push myname/myapp

推送镜像后，该镜像将用作另一台计算机上的缓存源。如果需要，BuildKit会自动从注册表中提取镜像。

    // on another machine
    $ docker build --cache-from myname/myapp .

> 注意：此功能需要BuildKit后端。您可以 启用BuildKit或使用buildx 插件。以前的构建器对重用来自预拉镜像的缓存的支持有限。

### 5.16 **压缩镜像的图层（-压缩）（实验）**

#### **5.16.1 总览**

生成镜像后，将新层压缩为具有单个新层的新镜像。压缩不会破坏任何现有镜像，而是会创建具有压缩层内容的新镜像。这实际上使所有Dockerfile命令看起来都是在单个图层上创建的。使用此方法保留构建缓存。

该--squash选项是实验功能，不应被认为是稳定的。

如果您的Dockerfile产生多层来修改同一文件（例如，在一个步骤中创建并在另一步骤中删除的文件），则压缩层将非常有用。对于其他用例，压缩镜像实际上可能会对性能产生负面影响；当拉出由多层组成的镜像时，可以并行拉出图层，并允许在镜像之间共享图层（节省空间）。

对于大多数用例，多阶段构建是更好的选择，因为它们可以对构建进行更细粒度的控制，并且可以利用构建器中的未来优化。 有关更多信息，请参考用户指南中的“ 使用多阶段构建”部分。

#### **5.16.2 已知限制**

该--squash选件有许多已知的限制：

挤压图层时，生成的镜像无法利用与其他镜像共享的图层的优势，并且可能会占用更多的空间。仍然支持共享基本镜像。
使用此选项时，由于存储镜像的两个副本，一个可能会占用更多空间，一个副本用于构建缓存，所有缓存层均完好无损，一个副本用于压缩版本。
虽然压缩层可能会产生较小的镜像，但可能会对性能产生负面影响，因为单层提取需要更长的时间，并且下载单层无法并行进行。
尝试压缩未更改文件系统的镜像时（例如，Dockerfile仅包含ENV指令），压缩步骤将失败（请参阅问题＃33823）。

#### **5.16.3 先决条件**

本页上的示例在Docker 1.13中使用实验模式。

--experimental启动Docker守护程序或experimental: true在daemon.json配置文件中进行设置时，可以使用标志启用实验模式。

默认情况下，实验模式为禁用状态。要查看当前配置，请使用docker version命令。

    Server:
     Version:      1.13.1
     API version:  1.26 (minimum version 1.12)
     Go version:   go1.7.5
     Git commit:   092cba3
     Built:        Wed Feb  8 06:35:24 2017
     OS/Arch:      linux/amd64
     Experimental: false
    
     [...]

要启用实验模式，用户需要在启用实验标志的情况下重启docker守护进程。

#### **5.16.4 启用DOCKER实验性**

从1.13.0版开始，实验功能已包含在标准Docker二进制文件中。为了启用实验性功能，您需要使用--experimentalflag 启动Docker守护程序。您还可以通过/etc/docker/daemon.json启用守护程序标志。例如

    {
        "experimental": true
    }

然后确保启用实验标记：

    $ docker version -f '{{.Server.Experimental}}'
    true

#### **5.16.5 用--SQUASH参数构建镜像**

以下是带有--squash参数的docker build的示例

    FROM busybox
    RUN echo hello > /hello
    RUN echo world >> /hello
    RUN touch remove_me /remove_me
    ENV HELLO world
    RUN rm /remove_me

test使用--squash参数构建名为的镜像。

    $ docker build --squash -t test .

    [...]

如果一切正常，历史记录将如下所示：

    $ docker history test
    
    IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
    4e10cb5b4cac        3 seconds ago                                                       12 B                merge sha256:88a7b0112a41826885df0e7072698006ee8f621c6ab99fca7fe9151d7b599702 to sha256:47bcc53f74dc94b1920f0b34f6036096526296767650f223433fe65c35f149eb
    <missing>           5 minutes ago       /bin/sh -c rm /remove_me                        0 B
    <missing>           5 minutes ago       /bin/sh -c #(nop) ENV HELLO=world               0 B
    <missing>           5 minutes ago       /bin/sh -c touch remove_me /remove_me           0 B
    <missing>           5 minutes ago       /bin/sh -c echo world >> /hello                 0 B
    <missing>           6 minutes ago       /bin/sh -c echo hello > /hello                  0 B
    <missing>           7 weeks ago         /bin/sh -c #(nop) CMD ["sh"]                    0 B
    <missing>           7 weeks ago         /bin/sh -c #(nop) ADD file:47ca6e777c36a4cfff   1.113 MB

我们可以发现所有层的名称均为<missing>，并且存在一个带有COMMENT的新层merge。

测试镜像，检查/remove_me是否消失，确保hello\nworld在/hello，确保HELLOenvvar的值为world。

## 6 **父命令**

命令 | 描述
--- | ---
docker | Docker CLI的基本命令。