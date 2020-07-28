@贝蒂 :unicorn: 的文档
> 官网文档地址：https://docs.docker.com/engine/reference/run/
# 目录

```
1. docker run 命令的一般形式
    1.1 镜像默认值参数

2. 用户自定义参数

3. 独立运行(Detached)模式 与 前台运行(foreground)模式
    3.1 独立运行(Detached)
    3.2 前台运行(foreground)
    
4. 容器身份识别
    4.1 容器名称 （--name）
    4.2 容器ID（类PID机制）
    4.3 Image[:tag]  镜像标签
    4.4 Image[@digest] 镜像摘要

5. PID设置

6. UTS设置（--uts）

7. IPC设置（--ipc）（IPC：Inter-Process Communication，进程间通信）

8. 网络设置

9. 容器的重启机制 (--restart)

10. 容器的退出机制

11. 清理容器(--rm)

12. 安全配置

13. 设定初始进程

14. 设置自定义的cgroup）

15. 资源的运行时刻约束
    15.1 用户内存限制
    15.2 内核内存约束
    15.3 限制
    15.4 CPU份额约束
    15.5 CPU周期约束
    15.6 Cpuset约束
    15.7 CPU配额限制
    15.8 块IO带宽（Blkio）约束

16. 附加组

17. 运行时刻特权以及Linux性能

18. 日志驱动

19. 覆盖Dockerfile镜像默认值
    19.1 CMD（默认命令或选项）
    19.2 ENTRYPOINT（默认命令在运行时执行）
    19.3 EXPOSE (incoming ports)
    19.4 ENV（环境变量）
    19.5 HEALTHCHECK
    19.6 TMPFS（挂载tmpfs文件系统）
    19.7 VOLUME（共享文件系统）
    19.8 USER
    19.10 WORKDIR
```


# **docker run 命令**

Docker将进程运行在独立的的**容器**中，而**容器**是在宿主机(host)上运行的进程，宿主机可以是本地主机，也可以是远程主机。

当docker用户执行docker run时，运行的容器进程是独立的，因为它具有自己的文件系统、自己的网络以及独立于主机的进程树。

## **1. docker run 命令的一般形式**

    docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]

docker run命令必须要指定一个**镜像(image)**，用于派生容器。


### **1.1 镜像默认值参数**：

* ***独立(Detached)运行*** 或 ***前台(foreground)运行***
* 容器身份识别
* 网络设置
* CPU和内存的运行时限制

docker用户可以使用 ```docker run [OPTIONS]``` 来添加或覆盖开发人员设置的镜像默认设置，此外，docker用户还可以覆盖Docker运行时本身设置的几乎所有默认设置。docker用户拥有覆盖镜像和Docker运行时默认值的能力，这就是为什么run具有比其他任何docker命令更多的选项的原因。

## **2. 用户自定义参数**

只有docker用户才能设置以下参数：

* ***独立(Detached)运行*** 或 ***前台(foreground)运行***
* 容器身份识别
* IPC设置
* 网络设置
* 重新启动策略
* 清理
* 资源的运行时限制
* 运行时特权和Linux功能


## **3. 独立运行(Detached)模式 与 前台运行(foreground)模式**

### **3.1 独立运行(Detached)**


    docker run -d=true 
或
    
    docker run -d

以独立模式启动的容器，会在**用于运行容器的根进程退出时**退出。

如果在 ```docker run``` 中将 ```-d``` 与 ```--rm``` 一起使用，则在**容器退出或守护进程退出时**将容器删除。

不要将```service [服务名] start```命令传递给独立运行的容器，如尝试启动nginx服务（ docker run -d -p 80:80 my_image service nginx start），此时由于根进程（service nginx start）返回，因此容器自动停止。若要启动此类web服务器之类的进程，请执行以下操作：

    $ docker run -d -p 80:80 my_image nginx -g 'daemon off;'

由于独立运行的容器不再监听 ```docker run``` 运行时所在的命令行，因此若要使用独立运行的容器进行输入、输出，请使用网络连接或共享卷。

若要重新附加到分离的容器，请使用 ```docker attach``` 命令。

### **3.2 前台运行(foreground)**

当不指定 ```-d``` 运行 ```docker run``` 时，默认容器将在前台运行。

```docker run``` 可以在容器中启动进程，并将控制台绑定到到进程的标准输入、输出和标准错误。它甚至可以假装为TTY并传递信号。

以下选项都是可配置的：

1.  **-a=[]** : 绑定到 `STDIN`, `STDOUT` 或 `STDERR`

默认情况下 ```docker``` 会将 ```stdout``` 和 ```stderr``` 同时绑定到控制台，你也可以随意指定这三个中的任意一个或多个，如：

```
$ docker run -a stdin -a stdout -i -t ubuntu /bin/bash
```

2. **-t**: 配置一个伪终端 (pseudo-tty)

3. **--sig-proxy=true**: Proxy all received signals to the process (non-TTY mode only)

4. **-i**: Keep STDIN open even if not attached

对于交互式进程（如shell），必须 -i 和 -t 一起使用才能为容器进程分配 tty。-i -t 通常可以写为 -it，在后面的示例中将会出现。当客户端从管道接收其标准输入时，禁止使用it，如：

```
$ echo test | docker run -i busybox cat
```

## **4. 容器身份识别**

### **4.1 容器名称 （--name）**

docker用户可以通过三种方式来鉴别一个容器：
1. UUID 长id - “f78375b1c487e03c9438c729345e54db9d20cfa2ac1fc3494b6eb60872e74778”
2. UUID 短id - “f78375b1c487”
3. 名称 - “evil_ptolemy”

UUID标识符来自Docker守护程序。如果未使用--name选项分配容器名称，则守护程序（Docker daemon）将为您生成一个随机字符串名称。定义一个name是向容器添加含义的便捷方法，如果指定name，则可以在Docker网络中引用容器时使用它。这同时适用于独立运行的和前台运行的Docker容器。

### **4.2 容器ID（类PID机制）**

为了更好地自动化，Docker可以实现将容器ID写至你所选的文件，类似程序将进程ID写至PID文件：

    --cidfile="": 将容器ID写至该文件


### **4.3 Image[:tag]  镜像标签**

通过标明一个tag，镜像的版本是可选的。例如：

    docker run ubuntu:14.04

### **4.4 Image[@digest]  镜像摘要**

使用v2或更新的镜像格式的镜像，具有摘要（digest)功能 - 一个内容可寻址标识符。

只要用于生成镜像的输入没变，那么镜像的摘要就是可预测、可引用的。

下列示例从名为 ```alpine``` 的镜像，使用摘要 ```sha256:9cacb71397b640eca97488cf08582ae4e4068513101088e9f96c9814bfda95e0```启动了一个容器：

    $ docker run alpine@sha256:9cacb71397b640eca97488cf08582ae4e4068513101088e9f96c9814bfda95e0 date


## **5. PID设置**

    --pid=""  : 为容器设置进程PID命名空间模式，
                 'container:<name|id>': 与另一个容器的PID命名空间合并
                 'host': 在容器内部使用宿主机的PID命名空间


默认情况下，所有容器都启用了PID命名空间。

PID命名空间提供了流程分离。PID命名空间可删除系统进程的视图，并允许重用进程ID，包括pid 1。

在某些情况下，用户希望容器共享主机的进程命名空间，并允许容器内的进程查看系统上的所有进程，例如，用户想使用诸如```strace```或```gdb```的调试工具来构建容器，并在容器内部调试进程时使用这些工具。

#### 示例1：在容器中使用htop （htop是top的升级版，top和ps是linux常用的管理进程的工具。linux中的htop类似win中的资源管理器）

创建此Dockerfile：

    FROM alpine:latest
    RUN apk add --update htop && rm -rf /var/cache/apk/*
    CMD ["htop"]


根据此Dockerfile构建镜像并将它tag为 ```myhtop``` ：

    $ docker build -t myhtop .


执行以下命令，在容器内部运行 ```htop``` 命令：

    $ docker run -it --rm --pid=host myhtop


与其他容器的pid命名空间结合，可以实现该容器的debugging。

#### 示例2

使用**redis服务器**启动以下容器：

    $ docker run --name my-redis -d redis


运行另一个有 ```strace``` 功能的容器来debug上述容器：（trace是一个可用于诊断、调试和教学的Linux用户空间跟踪器。我们用它来监控用户空间进程和内核的交互，比如系统调用、信号传递、进程状态变更等）

    $ docker run -it --pid=container:my-redis my_strace_docker_image bash
    $ strace -p 1


## **6. UTS设置（--uts）**

    --uts=""  : 为容器设置UTS命名空间模式，
       'host': 在容器内使用宿主机的UTS命名空间


UTS命名空间用于设置主机名、和对该命名空间中正在运行的进程可见的域。

默认情况下，所有容器（包括带有 ```--network=host``` 的容器）都有自己的UTS命名空间。该 ```host``` 设置将导致容器使用与宿主机相同的UTS名称空间。请注意，  ```--hostname``` 和 ```--domainname``` 在 ```host``` UTS模式下无效。

如果用户希望容器的主机名随着宿主机的主机名更改而更改，则需要与主机共享UTS命名空间，此选项也可以实现一个更进阶的操作 - 从容器内部更改宿主机的主机名。

## **7. IPC设置（--ipc）（IPC：Inter-Process Communication，进程间通信）**

    --ipc="MODE"  : 为容器设置IPC模式

MODE有以下选项：

值 | 说明
--- | ---
“” | 使用docker守护程序（daemon）的默认值
“none“ | 自身的私有IPC命名空间，未加载 /dev/shm
”private“ | 自身的私有IPC命名空间
”shareable“ | 自己的私有IPC命名空间，可以与其他容器共享
”container: <_name-or-ID_>“ | 加入另一个（“可共享的”）容器的IPC命名空间
”host“ | 使用宿主机系统的IPC命名空间

如果未指定，即使用守护程序默认值时，它可以是 ```"private"``` 的，也可以是 ```"shareable"``` 的，具体取决于守护程序的版本和配置。

IPC（POSIX / SysV IPC）命名空间提供命名共享内存段、信号量和消息队列的分隔。

共享内存段用于以内存速度加速进程间通信，而不是通过管道或网络堆栈，数据库和科学计算和金融服务行业的定制应用程序（通常是C / OpenMPI，C ++ /使用Boost库）通常使用共享内存。

如果将这些类型的应用程序分为多个容器，则可能需要共享容器的IPC机制，为主（即“捐赠者”）容器开启 ```"shareable"``` 模式， 并为其他容器开启 ```"container:<donor-name-or-ID>"``` 模式。

## **8. 网络设置**

支持的网络选项 | 说明
----- | -----
--dns=[]           | 为容器自定义dns服务器
--network="bridge" | 将容器连接至一个网络，默认使用bridge，说明见下表。
--network-alias=[] | 为容器添加网络范围的别名
--add-host=""      | 在/etc/hosts中添加一行（主机：IP地址）
--mac-address=""   | 设置容器的以太网设备的MAC地址
--ip=""            | 设置容器的以太网设备的IPv4地址
--ip6=""           | 设置容器的以太网设备的IPv6地址
--link-local-ip=[] | 设置一个或多个容器的以太网设备的链接本地IPv4/IPv6地址


***注：--network选项的可选值说明：***

* **'bridge': 默认设置。在主机上建立一个（俗称docker0）的网桥，并通过一对veth接口将容器连接至网桥。**
    该对veth接口的一侧留在宿主机侧并附加至网桥，另一侧被放置在容器内部，以便使用loopback接口。将为网桥的网络上的容器分配一个IP地址，流量将通过该网桥路由到容器。
    
* **'none': 无网络。**
    容器无法访问任何外部路由。容器仍然会启用loopback接口，但它没有通往外部流量的任何路由。
    
* **'container:<name|id>': 再利用另一个容器的网络堆栈，由该容器的name或id来指定**
    
    将网络设置为container一个容器后，将共享另一个容器的网络堆栈，另一个容器的名称必须以 ```--network container:<name|id>``` 的格式被提供。

    请注意，--add-host --hostname --dns --dns-search --dns-option和--mac-address在 ```container``` 网络模式下无效，并且--publish --publish-all --expose在 ```container``` 网络模式下也无效。
    
    使用一个绑定到localhost的Redis镜像来运行一个Redis容器，之后运行redis-cli命令并通过localhost接口连接至Redis服务器：

        $ docker run -d --name redis example/redis --bind 127.0.0.1
        $ # 使用redis容器的网络堆栈来访问localhost
        $ docker run --rm -it --network container:redis example/redis-cli -h 127.0.0.1

* **'host': 使用Docker宿主机的网络堆栈（网络性能最佳）** 
    
    将网络设置为host容器后，容器将共享主机的网络堆栈，并且来自主机的所有接口将对容器可用。容器的主机名将与宿主机系统上的主机名匹配。

    请注意，```--mac-address```在```host```网络模式下不可用。

    即使在 ```host``` 网络模式下，默认情况下，容器也有其自己的UTS命名空间，因此 ```--hostname```，```--domainname```在```host```网络模式下是允许的，并且只会更改容器内的主机名和域名。

    与```--hostname``` 类似，```--add-host```，```--dns```，```--dns-search```，和 ```--dns-option``` 选项都可以在host网络模式下使用。这些选项将在容器内部更新 ```/etc/hosts``` 或 ```/etc/resolv.conf``` ，但宿主机中的 ```/etc/hosts``` 和 ```/etc/resolv.conf``` 不会被改变。
    
    与默认 ```bridge``` 模式相比，该 ```host``` 模式提供了明显更好的网络性能，因为它使用了宿主机的本机网络堆栈，而网桥则必须通过docker守护程序进行一级虚拟化。当容器的网络性能至关重要时，建议以这种模式运行容器，例生产负载平衡器或高性能Web服务器。

* **'<network-name|<network-id>': 连接至一个用户自定义网络（使用 ```docker network create``` 来创建）**
    
    您可以使用Docker网络驱动程序，或外部网络驱动程序插件，来创建一个自定义网络。您可以将多个容器连接到同一网络。连接到用户自定义的网络后，这些容器可以通过仅使用另一个容器的IP地址，或名称，来轻松进行通信。
    
    对于 ```overlay``` 网络或支持多主机连接的自定义网络插件，连接到同一多主机网络但从不同引擎启动的容器也可以这种方式进行通信。
    
    以下示例使用内置的 ```bridge``` 网络驱动程序，并在创建的网络中运行容器来创建网络：
    
        $ docker network create -d bridge my-net
        $ docker run --network=my-net -itd --name=container3 busybox


在默认情况下，所有的容器都启用了联网功能，并且它们可以建立任何传出连接。用户可以使用 ```docker run --network none``` 命令完全禁用网络，从而禁用所有传入和传出网络。在这样的情况下，用户将只能通过通过文件I/O或STDIN和STDOUT来进行操作。

只有在默认选项（--network="bridge"）下才能实现发布端口和链接到其他容器。链接功能是已弃用的功能，推荐使用Docker网络驱动程序。

默认情况下，您的容器将使用与主机相同的DNS服务器，但是您可以使用 ```--dns``` 来覆盖它。

默认情况下，MAC地址是使用分配给容器的IP地址自动生成的，也可以通过使用 ```--mac-address``` 参数（格式为12:34:56:78:9a:bc：）来设置容器的MAC地址。请注意，Docker不会检查手动指定的MAC地址是否唯一。

## **9. 容器的重启机制 (--restart)**

使用 ```--restartDocker``` 来运行 ```docker run```，您可以指定重启策略，以设置容器在退出时应如何重启。

在重新启动策略被激活的容器上，在```docker ps```下它将被显示为 ```Up``` 或 ```Restarting```。

```docker events``` 命令可以查看生效的重启策略。

Docker支持以下重启策略：

策略 | 描述
---- | ----
no | 默认值，退出时不重启容器
on-failure[:max-retries] | 仅当容器以非零退出状态退出时才重新启动。限制Docker守护进程尝试重新启动的重试次数（可选）。
always | 无论退出状态如何，始终重新启动容器。当指定always时，Docker守护程序将尝试无限期重启容器。无论容器的当前状态如何，该容器还将始终在守护程序启动时启动。
unless-stopped | 无论退出状态如何（包括守护程序启动时），无论退出状态如何，都应始终重新启动容器，除非容器在停止Docker守护程序之前已处于停止状态。

在每次重新启动之前，添加一个不断增加的延迟（从100毫秒开始翻倍），以防止服务器泛滥。这意味着守护程序将等待100 ms，然后等待200 ms，400、800、1600，依此类推，直到达到 ```on-failure``` 限制，或者您 ```docker stop``` 或您 ```docker rm -f``` 该容器为止。

如果容器已被成功重启（容器已启动并运行至少10秒钟），则延迟将重置为其默认值100毫秒。

用户可以指定当使用 ```on-failure``` 策略时 ```Docker``` 尝试重新启动容器的最大次数，默认情况下 ```Docker``` 会无限重启容器。可以通过 ```docker inspect``` 来获取容器（已经尝试过的）重新启动次数，例如，获取容器 ```“my-container”``` 的重新启动次数：

    $ docker inspect -f "{{ .RestartCount }}" my-container
    # 2

或者，获取上一次（重新）启动容器的时间：

    $ docker inspect -f "{{ .State.StartedAt }}" my-container
    # 2015-03-04T23:47:07.691840179Z

容器重新启动时，连接的客户端将断开连接，因此同时使用 ```--restart```（重新启动策略）和 ```--rm```（清理）会导致错误。

##### 例子

这将以always重启策略来运行该容器，因此如果该容器退出，Docker将对其进行重启：

    $ docker run --restart=always redis


这将以 ```on-failure``` 重启策略运行容器，且最大重启计数为***10***。如果容器连续以非零退出状态退出***10***次以上，则 ```Docker``` 将中止尝试重启容器的操作。提供最大重启限制仅在 ```on-failure``` 重启策略下有效：

    $ docker run --restart=on-failure:10 redis


## **10. 容器的退出机制**

 **退出代码（exit code）** 可以提供有关为何容器无法运行、或为何容器会退出的信息。

当docker run使用**非零代码**退出时，**退出代码**遵循 ```chroot``` 标准，请参见下文：

* ***125 - 错误是由Docker守护程序本身造成的***

    $ docker run --foo busybox; echo $?
    
    flag provided but not defined: --foo
    See 'docker run --help'.
    125


* ***126 - 无法调用命令***

    $ docker run busybox /etc; echo $?
    
    docker: Error response from daemon: Container command '/etc' could not be invoked.
    126


* ***127 - 找不到命令***

    $ docker run busybox foo; echo $?
    
    docker: Error response from daemon: Container command 'foo' not found or does not exist.
    127


* ***其他情况***

    $ docker run busybox /bin/sh -c 'exit 3'; echo $?
    
    3


## **11. 清理容器 (--rm)**

默认情况下，即使容器退出后，容器的文件系统也会保留，这使得调试容易得多（因为您可以检查最终状态），并且默认情况下保留所有数据。

但是，如果您正在运行短期的前台进程，那么这些容器文件系统确实会堆积起来。

因此，如果您希望 ```Docker``` 在容器退出时自动清理容器并删除文件系统，则可以添加 ```--rm``` 标志：

    --rm=false: 在容器退出时自动清理


> 注意：

如果设置该 ```--rm``` 标志，则在删除容器时，Docker还将删除与该容器关联的匿名卷。这类似于运行docker rm -v my-container，仅删除**没有名称的卷**。

例如，运行以下命令时：

    docker run --rm -v /foo -v awesome:/bar busybox top

 ```/foo``` 的卷将被删除，但 ```/bar``` 的卷不会被移除。通过 ```--volumes-from``` 被继承的卷将通过相同的逻辑被删除：如果该卷指定了一个名称，则不会删除该卷。


## **12. 安全配置**

选项 | 描述
---- | ----
--security-opt="label=user:USER" | 设置容器的标签用户
--security-opt="label=role:ROLE" | 设置容器的标签角色
--security-opt="label=type:TYPE" | 设置容器的标签类型
--security-opt="label=level:LEVEL" | 设置容器的标签级别
--security-opt="label=disable" | 关闭容器的标签限制
--security-opt="apparmor=PROFILE" | 设置要应用于容器的 ```apparmor``` 配置文件
--security-opt="no-new-privileges:true" | 禁止容器进程获取新特权
--security-opt="seccomp=unconfined" | 关闭容器的 ```seccomp``` 限制
--security-opt="seccomp=profile.json" | 白名单的 ```syscalls seccomp``` Json文件用作 ```seccomp``` 筛选器

您可以通过指定 ```--security-opt``` 标志来覆盖每个容器的默认标签方案。在以下命令中指定级别可以使您在容器之间共享相同的内容：

    $ docker run --security-opt label=level:s0:c100,c200 -it fedora bash

> 注意：当前不支持MLS标签的自动翻译。

要禁用此容器的安全标签而不是使用该 ```--privileged``` 标志运行 ，请使用以下命令：

    $ docker run --security-opt label=disable -it fedora bash

如果要对容器内的进程采用更严格的安全策略，则可以为容器指定其他类型。您可以通过执行以下命令来运行仅允许在Apache端口上侦听的容器：

    $ docker run --security-opt label=type:svirt_apache_t -it centos bash

> 注意：您将必须编写定义 ```svirt_apache_t``` 类型的策略。

如果要阻止容器进程获取其他特权，可以执行以下命令：

    $ docker run --security-opt no-new-privileges -it centos bash

这意味着发出诸如 ```su``` 或的特权的命令 ```sudo``` 将不再起作用。它还会导致在删除特权后，稍后再应用任何 ```seccomp``` 过滤器，这可能意味着您可以使用一组更具限制性的过滤器。有关更多详细信息，请参见内核文档。

## **13. 设定初始进程**

您可以使用 ```--init``` 标志来指定一个**初始化进程**用作容器中的**PID 1**。

**指定初始化进程**可以确保，在创建的容器内执行初始化系统的一般职责，例如处理僵尸进程。

使用的默认初始化进程是 ```docker-init``` 在Docker守护进程的系统路径中找到的第一个可执行文件。```docker-init``` 默认安装中包含的此二进制文件是由 ```tini``` 支持的。

## **14. 设置自定义的cgroup）**

> **cgroups**，其名称源自控制组群（control groups）的简写，是Linux内核的一个功能，用来限制、控制与分离一个进程组的资源（如CPU、内存、磁盘输入输出等。

使用 ```--cgroup-parent``` 标志，您可以传递特定的 ```cgroup``` 来运行容器，这允许您自己创建和管理 ```cgroup``` 。您可以为这些 ```cgroup``` 定义自定义资源，并将容器放在**公共父组**下。

## **15. 资源的运行时刻约束**
// TODO

操作员还可以调整容器的性能参数：

选项 | 描述
----- | -----
-m， --memory="" | 内存限制（格式：）<number>[<unit>]。数字是一个正整数。单位可以是一个b，k，m，或g。最小为4M。
--memory-swap="" | 总内存限制（内存+交换，格式：）<number>[<unit>]。数字是一个正整数。单位可以是一个b，k，m，或g。
--memory-reservation="" | 内存软限制（格式：）<number>[<unit>]。数字是一个正整数。单位可以是一个b，k，m，或g。
--kernel-memory="" | 内核内存限制（格式：）<number>[<unit>]。数字是一个正整数。单位可以是一个b，k，m，或g。最小为4M。
-c， --cpu-shares=0 | CPU份额（相对重量）
--cpus=0.000 | CPU数量。数字是小数。0.000表示没有限制。
--cpu-period=0 | 限制CPU CFS（完全公平调度程序）期限
--cpuset-cpus="" | 允许执行的CPU（0-3，0,1）
--cpuset-mems="" | 允许执行的内存节点（MEM）（0-3，0,1）。仅在NUMA系统上有效。
--cpu-quota=0 | 限制CPU CFS（完全公平的调度程序）配额
--cpu-rt-period=0 | 限制CPU的实时时间。以微秒为单位。需要设置父级cgroup，并且不能高于父级cgroup。还要检查rtprio ulimits。
--cpu-rt-runtime=0 | 限制CPU实时运行时间。以微秒为单位。需要设置父级cgroup，并且不能高于父级cgroup。还要检查rtprio ulimits。
--blkio-weight=0 | 块IO权重（相对权重）接受10到1000之间的权重值。
--blkio-weight-device="" | 块IO重量（相对设备重量，格式：DEVICE_NAME:WEIGHT）
--device-read-bps="" | 限制从设备读取的速率（格式：）<device-path>:<number>[<unit>]。数字是一个正整数。单位可以是一个kb，mb或gb。
--device-write-bps="" | 将写入速率限制为设备（格式：）<device-path>:<number>[<unit>]。数字是一个正整数。单位可以是一个kb，mb或gb。
--device-read-iops="" | 限制从设备（格式：）的读取速率（每秒IO <device-path>:<number>）。数字是一个正整数。
--device-write-iops="" | 将写入速率（每秒的IO）限制为设备（格式：）<device-path>:<number>。数字是一个正整数。
--oom-kill-disable=false | 是否为容器禁用OOM Killer。
--oom-score-adj=0 | 调整容器的OOM首选项（-1000到1000）
--memory-swappiness="" | 调整容器的内存交换行为。接受0到100之间的整数。
--shm-size="" | 的大小/dev/shm。格式为<number><unit>。number必须大于0。单位是可选的，可以是b（字节），k（千字节），m（兆字节）或g（千兆字节）。如果省略单位，则系统使用字节。如果您完全省略尺寸，系统将使用64m。


### **15.1 用户内存限制**

我们有四种设置用户内存使用量的方法：

选项 | 结果
---- | ----
memory = inf，memory-swap = inf（默认 | 容器没有内存限制。容器可以使用所需的内存。
内存= L <inf，内存交换= inf | （指定内存，并将memory-swap设置为-1）容器不允许使用超过L个字节的内存，但是可以根据需要使用尽可能多的交换（如果主机支持交换内存）。
内存= L <inf，内存交换= 2 * L | （请指定无内存交换的内存）容器不得使用超过L个字节的内存，而交换加内存使用量则是该字节的两倍。
内存= L <inf，内存交换= S <inf，L <= S | （同时指定内存和内存交换）容器不允许使用超过L个字节的内存，交换和内存使用量受S限制。


例子：

    $ docker run -it ubuntu:14.04 /bin/bash


我们没有对内存进行任何设置，这意味着容器中的进程可以使用所需的内存并交换所需的内存。

    $ docker run -it -m 300M --memory-swap -1 ubuntu:14.04 /bin/bash


我们设置了内存限制和禁用了交换内存限制，这意味着容器中的进程可以使用300M内存，并根据需要使用尽可能多的交换内存（如果主机支持交换内存）。

    $ docker run -it -m 300M ubuntu:14.04 /bin/bash


我们仅设置内存限制，这意味着容器中的进程可以使用300M内存和300M交换内存，默认情况下，总虚拟内存大小（--memory-swap）将设置为内存的两倍，在这种情况下，内存+ swap将为2 * 300M，因此进程也可以使用300M交换内存。

    $ docker run -it -m 300M --memory-swap 1G ubuntu:14.04 /bin/bash


我们同时设置了内存和交换内存，因此容器中的进程可以使用300M内存和700M交换内存。

内存保留是一种内存软限制，它可以实现更大的内存共享。在正常情况下，容器可以使用所需的内存量，并且仅受-m/ --memory选项设置的硬性限制 。设置内存预留后，Docker会检测到内存争用或内存不足，并强制容器将其使用限制为预留限制。

始终将内存保留值设置为硬限制以下，否则硬限制优先。保留为0等于不设置保留。默认情况下（未设置保留），内存保留与硬盘限制相同。

内存保留是一项软限制功能，不能保证不会超出限制。取而代之的是，此功能试图确保在内存竞争激烈时，根据预留提示/设置分配内存。

以下示例将内存（-m）限制为500M，并将内存预留设置为200M。

    $ docker run -it -m 500M --memory-reservation 200M ubuntu:14.04 /bin/bash


在这种配置下，当容器消耗的内存大于200M且小于500M时，下一个系统内存回收将尝试将容器内存缩小到200M以下。

下面的示例将内存保留设置为1G，没有硬盘限制。

    $ docker run -it --memory-reservation 1G ubuntu:14.04 /bin/bash


容器可以使用所需的内存。内存预留设置可确保容器长时间不占用过多内存，因为每次回收内存都会将容器的消耗减少到预留空间。

默认情况下，如果发生内存不足（OOM）错误，内核将终止容器中的进程。要更改此行为，请使用--oom-kill-disable选项。仅在还设置了该-m/--memory选项的容器上禁用OOM杀手 。如果-m未设置该标志，则可能导致主机内存不足，并要求终止主机的系统进程以释放内存。

以下示例将内存限制为100M，并为此容器禁用OOM杀手：

    $ docker run -it -m 100M --oom-kill-disable ubuntu:14.04 /bin/bash


以下示例说明了使用标志的危险方式：

    $ docker run -it --oom-kill-disable ubuntu:14.04 /bin/bash


容器具有无限的内存，这可能导致主机内存不足，并需要终止系统进程来释放内存。--oom-score-adj 可以更改该参数以选择在系统内存不足时将杀死哪些容器的优先级，负分数会使它们被杀死的可能性较小，而正分数则更有可能被杀死。

### **15.2 内核内存约束**

内核内存从根本上不同于用户内存，因为不能交换内核内存。无法交换使得容器可以通过消耗过多的内核内存来阻止系统服务。内核内存包括：

* 堆叠页面
* 平板页面
* 插槽内存压力
* tcp内存压力

您可以设置内核内存限制来限制这些类型的内存。例如，每个进程都消耗一些堆栈页面。通过限制内核内存，可以防止内核内存使用率过高时创建新进程。

内核内存永远不会完全独立于用户内存。而是在用户内存限制的范围内限制内核内存。假设“ U”是用户内存限制，“ K”是内核限制。有三种可能的方式来设置限制：

选项 | 结果
U！= 0，K = inf（默认） | 这是使用内核内存之前已经存在的标准内存限制机制。内核内存被完全忽略。
U！= 0，K <U | 内核内存是用户内存的子集。此设置在每个cgroup的内存总量被过量使用的部署中很有用。绝对不建议过度使用内核内存限制，因为此框仍然会耗尽不可回收的内存。在这种情况下，您可以配置K，以便所有组的总和永远不大于总内存。然后，以系统的服务质量为代价自由设置U。
U！= 0，K> U | 由于内核内存费用也被馈送到用户计数器，并且针对两种内存的容器触发回收。此配置为管理员提供了内存的统一视图。对于只想跟踪内核内存使用情况的人来说，它也很有用。


例子：

    $ docker run -it -m 500M --kernel-memory 50M ubuntu:14.04 /bin/bash
我们设置了内存和内核内存，因此容器中的进程总共可以使用500M内存，在这500M内存中，可以是50M内核内存顶部。

    $ docker run -it --kernel-memory 50M ubuntu:14.04 /bin/bash
我们在不使用-m的情况下设置了内核内存，因此容器中的进程可以使用所需数量的内存，但它们只能使用50M内核内存。

### **15.3 限制**

默认情况下，容器的内核可以换出一定比例的匿名页面。要为容器设置此百分比，请指定--memory-swappiness0到100之间的值。0值将关闭匿名页面交换。值100会将所有匿名页面设置为可交换。默认情况下，如果不使用 --memory-swappiness，则将从父级继承内存交换值。

例如，您可以设置：

    $ docker run -it --memory-swappiness=0 ubuntu:14.04 /bin/bash


--memory-swappiness当您要保留容器的工作集并避免交换性能损失时，设置该选项很有用。

### **15.4 CPU份额约束**

默认情况下，所有容器获得相同比例的CPU周期。可以通过更改容器的CPU份额权重（相对于所有其他正在运行的容器的权重）来修改此比例。

要从默认值1024修改比例，请使用-c或--cpu-shares 标志将权重设置为2或更高。如果设置为0，则系统将忽略该值，并使用默认值1024。

该比例仅在运行CPU密集型进程时适用。当一个容器中的任务空闲时，其他容器可以使用剩余的CPU时间。实际的CPU时间量取决于系统上运行的容器数。

例如，考虑三个容器，一个容器的cpu份额为1024，另两个容器的cpu份额设置为512。当所有三个容器中的进程尝试使用100％的CPU时，第一个容器将获得50％的CPU。总CPU时间。如果添加第四个容器的cpu份额为1024，则第一个容器仅获得33％的CPU。剩余的容器接收CPU的16.5％，16.5％和33％。

在多核系统上，CPU时间的份额分配在所有CPU核上。即使容器限制为少于100％的CPU时间，它也可以使用每个CPU核心的100％。

例如，考虑具有三个以上内核的系统。如果您在一个容器{C0}中-c=512运行一个进程来启动一个容器，而在另一个容器 {C1}中-c=1024运行两个进程来启动，则可能导致以下CPU份额划分：

PID | container | CPU | CPUshare
---- | ---- | ---- | ----
100 | {C0} | 0 | 100% of CPU0
101 | {C1} | 1 | 100% of CPU1
102 | {C1} | 2 | 100% of CPU2

### **15.5 CPU周期约束**

默认的CPU CFS（完全公平调度程序）周期为100ms。我们可以使用 --cpu-period设置CPU的时间来限制容器的CPU使用率。并且通常--cpu-period应该使用--cpu-quota。

例子：

    $ docker run -it --cpu-period=50000 --cpu-quota=25000 ubuntu:14.04 /bin/bash
如果有1个CPU，则意味着该容器每50毫秒可获取50％的CPU运行时间。

除了使用--cpu-period和--cpu-quota设置CPU周期约束外，还可以指定--cpus浮点数来达到相同的目的。例如，如果有1个CPU，--cpus=0.5则将获得与设置--cpu-period=50000和--cpu-quota=25000（50％CPU）相同的结果。

默认值--cpus就是0.000，这意味着没有限制。

有关更多信息，请参阅有关带宽限制的CFS文档。

### **15.6 Cpuset约束**

我们可以设置cpus以允许容器执行。

例子：

    $ docker run -it --cpuset-cpus="1,3" ubuntu:14.04 /bin/bash


这意味着容器中的进程可以在cpu 1和cpu 3上执行。

    $ docker run -it --cpuset-cpus="0-2" ubuntu:14.04 /bin/bash


这意味着容器中的进程可以在cpu 0，cpu 1和cpu 2上执行。

我们可以设置允许在其中执行容器的内存。仅在NUMA系统上有效。

例子：

    $ docker run -it --cpuset-mems="1,3" ubuntu:14.04 /bin/bash


本示例将容器中的进程限制为仅使用来自内存节点1和3的内存。

    $ docker run -it --cpuset-mems="0-2" ubuntu:14.04 /bin/bash


本示例将容器中的进程限制为仅使用来自内存节点0、1和2的内存。

### **15.7 CPU配额限制**

该--cpu-quota标志限制了容器的CPU使用率。默认0值允许容器占用100％的CPU资源（1个CPU）。CFS（完全公平调度程序）处理用于执行进程的资源分配，并且是内核使用的默认Linux调度程序。将此值设置为50000可将容器限制为CPU资源的50％。对于多个CPU，请--cpu-quota根据需要进行调整。有关更多信息，请参阅有关带宽限制的CFS文档。

### **15.8 块IO带宽（Blkio）约束**

默认情况下，所有容器都获得相同比例的块IO带宽（blkio）。该比例为500。要修改此比例，请使用该--blkio-weight标志相对于所有其他运行容器的权重更改容器的blkio权重。

注意：

blkio权重设置仅适用于直接IO。当前不支持缓冲的IO。

该--blkio-weight标志可以将权重设置为10到1000之间的值。例如，以下命令创建两个具有不同blkio权重的容器：

    $ docker run -it --name c1 --blkio-weight 300 ubuntu:14.04 /bin/bash
    $ docker run -it --name c2 --blkio-weight 600 ubuntu:14.04 /bin/bash


如果要同时在两个容器中阻止IO，例如：

    $ time dd if=/mnt/zerofile of=test.out bs=1M count=1024 oflag=direct


您会发现时间比例与两个容器的blkio重量比例相同。

该--blkio-weight-device="DEVICE_NAME:WEIGHT"标志设置特定的设备权重。的DEVICE_NAME:WEIGHT是含有一个冒号分隔的设备名称和重量的字符串。例如，将/dev/sda设备权重设置为200：

    $ docker run -it \
        --blkio-weight-device "/dev/sda:200" \
        ubuntu


如果您同时指定--blkio-weight和--blkio-weight-device，则Docker使用--blkio-weight默认值权重，并使用--blkio-weight-device 特定设备上的新值覆盖默认值。以下示例使用默认权重，300并将/dev/sda该权重设置为时覆盖此默认值200：

    $ docker run -it \
        --blkio-weight 300 \
        --blkio-weight-device "/dev/sda:200" \
        ubuntu


该--device-read-bps标志限制了从设备读取的速率（每秒字节数）。例如，该命令创建一个容器，并且限制了读出速度，以1mb 从每秒/dev/sda：

    $ docker run -it --device-read-bps /dev/sda:1mb ubuntu


该--device-write-bps标志限制了设备的写入速率（每秒字节数）。例如，此命令创建一个容器并将以下内容的写入速率限制为1mb 每秒/dev/sda：

    $ docker run -it --device-write-bps /dev/sda:1mb ubuntu


两个标志都采用<device-path>:<limit>[unit]格式限制。读写速率都必须为正整数。您可以以kb （千字节），mb（兆字节）或gb（千兆字节）指定速率。

该--device-read-iops标志限制了设备的读取速率（每秒IO）。例如，此命令创建一个容器并将读取速率1000从限制为每秒 IO /dev/sda：

    $ docker run -ti --device-read-iops /dev/sda:1000 ubuntu


该--device-write-iops标志限制了设备的写入速率（每秒IO）。例如，此命令创建一个容器并将1000每秒IO 的写入速率限制 为/dev/sda：

    $ docker run -ti --device-write-iops /dev/sda:1000 ubuntu


两个标志都采用<device-path>:<limit>格式限制。读写速率都必须为正整数。

## **16. 附加组**
// TODO

    --group-add: Add additional groups to run as


默认情况下，docker容器进程运行时会查找指定用户的补充组。如果要向该组列表添加更多内容，则可以使用此标志：

    $ docker run --rm --group-add audio --group-add nogroup --group-add 777 busybox id

    uid=0(root) gid=0(root) groups=10(wheel),29(audio),99(nogroup),777

## **17. 运行时刻特权以及Linux性能**
// TODO

选项 | 描述
--- | ---
--cap-add | 添加Linux功能
--cap-drop | 放弃Linux功能
--privileged | 赋予此容器扩展的特权
--device=[] | 允许您在没有--privileged标志的情况下在容器内运行设备。
默认情况下，Docker容器是“无特权的”，并且例如不能在Docker容器内运行Docker守护程序。这是因为默认情况下，不允许容器访问任何设备，但是授予“特权”容器访问所有设备的权限（请参阅cgroups devices文档）。

当操作员执行时docker run --privileged，Docker将启用对主机上所有设备的访问，并在AppArmor或SELinux中进行一些配置，以允许容器对主机的访问几乎与在主机上容器外部运行的进程相同。--privileged可以在Docker Blog上找到 有关运行with的其他信息。

如果要限制对一个或多个特定设备的访问，可以使用该--device标志。它允许您指定一个或多个在容器内可访问的设备。

    $ docker run --device=/dev/snd:/dev/snd ...

默认情况下，容器就可以read，write和mknod这些设备。可以使用:rwm每个--device标志的第三组选项来覆盖它：

    $ docker run --device=/dev/sda:/dev/xvdc --rm -it ubuntu fdisk  /dev/xvdc

Command (m for help): q

    $ docker run --device=/dev/sda:/dev/xvdc:r --rm -it ubuntu fdisk  /dev/xvdc

    You will not be able to write the partition table.

Command (m for help): q

    $ docker run --device=/dev/sda:/dev/xvdc:w --rm -it ubuntu fdisk  /dev/xvdc
        crash....

    $ docker run --device=/dev/sda:/dev/xvdc:m --rm -it ubuntu fdisk  /dev/xvdc
    fdisk: unable to open /dev/xvdc: Operation not permitted
另外--privileged，操作员可以使用--cap-add和对功能进行精细控制--cap-drop。默认情况下，Docker具有保留的默认功能列表。下表列出了默认情况下允许并可以删除的Linux功能选项。

能力钥匙 | 能力描述
---- | ----
SETPCAP | 修改流程功能。
麦克诺德 | 使用mknod（2）创建特殊文件。
AUDIT_WRITE | 将记录写入内核审核日志。
周恩来 | 对文件UID和GID进行任意更改（请参阅chown（2））。
NET_RAW | 使用RAW和PACKET插槽。
DAC_OVERRIDE | 绕过文件读取，写入和执行权限检查。
福纳 | 绕过权限检查通常需要进程的文件系统UID与文件的UID匹配的操作。
FSETID | 修改文件时，请勿清除set-user-ID和set-group-ID权限位。
杀 | 绕过许可检查以发送信号。
SETGID | 对进程GID和补充GID列表进行任意处理。
SETUID | 对进程UID进行任意操作。
NET_BIND_SERVICE | 将套接字绑定到Internet域特权端口（端口号小于1024）。
SYS_CHROOT | 使用chroot（2），更改根目录。
集资基金 | 设置文件功能。


下表显示了默认情况下不授予的功能，可以添加这些功能。

能力钥匙 | 能力描述
---- | ----
SYS_MODULE | 加载和卸载内核模块。
SYS_RAWIO | 执行I / O端口操作（iopl（2）和ioperm（2））。
SYS_PACCT | 使用acct（2），打开或关闭进程记帐。
SYS_ADMIN | 执行一系列系统管理操作。
SYS_NICE | 提高进程的nice值（nice（2），setpriority（2））并为任意进程更改nice的值。
SYS_RESOURCE | 覆盖资源限制。
SYS_TIME | 设置系统时钟（settimeofday（2），stime（2），adjtimex（2））; 设置实时（硬件）时钟。
SYS_TTY_CONFIG | 使用vhangup（2）; 在虚拟终端上使用各种特权的ioctl（2）操作。
AUDIT_CONTROL | 启用和禁用内核审核；更改审核过滤器规则；检索审核状态和过滤规则。
MAC_ADMIN | 允许MAC配置或状态更改。为Smack LSM实施。
MAC_OVERRIDE | 覆盖强制访问控制（MAC）。为Smack Linux安全模块（LSM）实现。
NET_ADMIN | 执行各种与网络相关的操作。
系统日志 | 执行特权的syslog（2）操作。
DAC_READ_SEARCH | 绕过文件读取权限检查以及目录读取和执行权限检查。
LINUX_IMMUTABLE | 设置FS_APPEND_FL和FS_IMMUTABLE_FL i节点标志。
NET_BROADCAST | 进行套接字广播，并收听多播。
IPC_LOCK | 锁定内存（mlock（2），mlockall（2），mmap（2），shmctl（2））。
IPC_OWNER | 绕过权限检查对System V IPC对象的操作。
SYS_PTRACE | 使用ptrace（2）跟踪任意进程。
SYS_BOOT | 使用reboot（2）和kexec_load（2），重新引导并加载新内核以供以后执行。
租 | 在任意文件上建立租约（请参阅fcntl（2））。
WAKE_ALARM | 触发将唤醒系统的内容。
BLOCK_SUSPEND | 使用可以阻止系统挂起的功能。

功能（7）-Linux手册页上提供了更多参考信息。

这两个标志都支持value ALL，因此，如果操作员希望拥有所有功能，但MKNOD可以使用：

    $ docker run --cap-add=ALL --cap-drop=MKNOD ...
为了与网络堆栈进行交互，--privileged应该使用它们--cap-add=NET_ADMIN来修改网络接口，而不是使用它们。

    $ docker run -it --rm  ubuntu:14.04 ip link add dummy0 type dummy

RTNETLINK answers: Operation not permitted

    $ docker run -it --rm --cap-add=NET_ADMIN ubuntu:14.04 ip link add dummy0 type dummy
要挂载基于FUSE的文件系统，您需要将--cap-add和 结合使用--device：

    $ docker run --rm -it --cap-add SYS_ADMIN sshfs sshfs sven@10.10.10.20:/home/sven /mnt

fuse: failed to open /dev/fuse: Operation not permitted

    $ docker run --rm -it --device /dev/fuse sshfs sshfs sven@10.10.10.20:/home/sven /mnt

fusermount: mount failed: Operation not permitted

    $ docker run --rm -it --cap-add SYS_ADMIN --device /dev/fuse sshfs

    // sshfs sven@10.10.10.20:/home/sven /mnt
    The authenticity of host '10.10.10.20 (10.10.10.20)' can't be established.
    ECDSA key fingerprint is 25:34:85:75:25:b0:17:46:05:19:04:93:b5:dd:5f:c6.
    Are you sure you want to continue connecting (yes/no)? yes
    sven@10.10.10.20's password:
    
    root@30aa0cfaf1b5:/# ls -la /mnt/src/docker
    
    total 1516
    drwxrwxr-x 1 1000 1000   4096 Dec  4 06:08 .
    drwxrwxr-x 1 1000 1000   4096 Dec  4 11:46 ..
    -rw-rw-r-- 1 1000 1000     16 Oct  8 00:09 .dockerignore
    -rwxrwxr-x 1 1000 1000    464 Oct  8 00:09 .drone.yml
    drwxrwxr-x 1 1000 1000   4096 Dec  4 06:11 .git
    -rw-rw-r-- 1 1000 1000    461 Dec  4 06:08 .gitignore
    ....

默认的seccomp配置文件将根据所选功能进行调整，以允许使用该功能允许的功能，因此自Docker 1.12起，您不必对此进行调整。在Docker 1.10和1.11中没有发生这种情况，可能有必要使用自定义seccomp配置文件或--security-opt seccomp=unconfined在添加功能时使用。


## **18. 日志驱动**
// TODO

容器可以具有与Docker守护程序不同的日志记录驱动程序。--log-driver=VALUE与docker run命令一起使用可配置容器的日志记录驱动程序。支持以下选项：

司机 | 描述
--- | ---
none | 禁用容器的任何日志记录。docker logs此驱动程序将不可用。
json-file | Docker的默认日志记录驱动程序。将JSON消息写入文件。此驱动程序不支持任何日志记录选项。
syslog | Docker的Syslog日志记录驱动程序。将日志消息写入syslog。
journald | Docker的日志记录驱动程序。将日志消息写入journald。
gelf | 用于Docker的Graylog扩展日志格式（GELF）日志记录驱动程序。将日志消息写入GELF端点（如Graylog或Logstash）。
fluentd | Docker的流利日志记录驱动程序。将日志消息写入fluentd（向前输入）。
awslogs | Docker的Amazon CloudWatch Logs日志记录驱动程序。将日志消息写入Amazon CloudWatch Logs
splunk | 用于Docker的Splunk日志记录驱动程序。将日志消息写入到splunk使用事件Http收集器。
该docker logs命令仅对json-file和journald 驱动程序可用。有关使用日志记录驱动程序的详细信息，请参阅“ 配置日志记录驱动程序”。


## **19. 覆盖Dockerfile镜像默认值**
// TODO

当开发人员从Dockerfile生成镜像 或提交镜像时，开发人员可以设置许多默认参数，这些默认参数在镜像作为容器启动时生效。

在Dockerfile命令的四个不能在运行时被覆盖：FROM， MAINTAINER，RUN，和ADD。其他所有内容在中都有相应的覆盖docker run。我们将介绍开发人员可能在每个Dockerfile指令中设置的内容，以及操作员如何覆盖该设置。

### **19.1 CMD（默认命令或选项）**

COMMAND在Docker命令行中调用可选选项：

    $ docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]

该命令是可选的，因为创建的人IMAGE可能已经COMMAND使用Dockerfile CMD 指令提供了默认值。作为操作员（从镜像中运行容器的人员），您CMD只需指定new 即可覆盖该指令 COMMAND。

如果图片也指定，ENTRYPOINT则将CMD或COMMAND 附加为参数ENTRYPOINT。

### **19.2 ENTRYPOINT（默认命令在运行时执行）**

    --entrypoint="": Overwrite the default entrypoint set by the image

该ENTRYPOINT镜像是类似COMMAND，因为它指定了可执行文件运行容器启动时，但它是（故意）更难以覆盖。在ENTRYPOINT给出了一个容器，它的默认性质或行为，所以，当你设置一个 ENTRYPOINT可以运行的容器，就好像它是二进制，完全使用默认选项，并且可以在通过更多的选择传球 COMMAND。但是，有时操作员可能希望在容器内运行其他内容，因此您可以ENTRYPOINT在运行时通过使用字符串指定new 来覆盖默认值ENTRYPOINT。这是一个如何在已设置为自动运行其他内容（例如/usr/bin/redis-server）的容器中运行Shell的示例：

    $ docker run -it --entrypoint /bin/bash example/redis

或两个如何将更多参数传递给该ENTRYPOINT的示例：

    $ docker run -it --entrypoint /bin/bash example/redis -c ls -l
    $ docker run -it --entrypoint /usr/bin/redis-cli example/redis --help

您可以通过传递空字符串来重置容器入口点，例如：

    $ docker run -it --entrypoint="" mysql bash

注意

传递--entrypoint将清除镜像上设置的任何默认命令（即CMD，用于构建镜像的Dockerfile中的任何指令）。

### **19.3 EXPOSE (incoming ports)**

以下run命令选项可用于容器网络：

    --expose=[]: Expose a port or a range of ports inside the container.
                 These are additional to those exposed by the `EXPOSE` instruction
    -P         : Publish all exposed ports to the host interfaces
    -p=[]      : Publish a container's port or a range of ports to the host
                   format: ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort | containerPort
                   Both hostPort and containerPort can be specified as a
                   range of ports. When specifying ranges for both, the
                   number of container ports in the range must match the
                   number of host ports in the range, for example:
                       -p 1234-1236:1234-1236/tcp
    
                   When specifying a range for hostPort only, the
                   containerPort must not be a range.  In this case the
                   container port is published somewhere within the
                   specified hostPort range. (e.g., `-p 1234-1236:1234/tcp`)
    
                   (use 'docker port' to see the actual mapping)
    
    --link=""  : Add link to another container (<name or id>:alias or <name or id>)

除了该EXPOSE指令外，镜像开发人员对网络没有太多控制权。该EXPOSE指令定义了提供服务的初始传入端口。这些端口可用于容器内部的进程。操作员可以使用该--expose 选项添加到裸露的端口。

要暴露容器的内部端口，操作员可以使用-P或-p标志启动容器。主机上可以访问裸露的端口，并且所有可访问主机的客户端都可以使用这些端口。

该-P选项将所有端口发布到主机接口。Docker将每个公开端口绑定到主机上的随机端口。端口范围在定义 的临时端口范围内/proc/sys/net/ipv4/ip_local_port_range。使用该-p标志可以显式映射单个端口或端口范围。

容器内部（服务在其中进行侦听的端口）的端口号不需要与容器外部（客户端进行连接的地方）暴露的端口号相匹配。例如，在容器内，HTTP服务正在端口80上侦听（因此镜像开发人员EXPOSE 80在Dockerfile中指定了端口）。在运行时，端口可能绑定到主机上的42800。要查找主机端口和公开端口之间的映射，请使用docker port。

如果操作员--link在默认网桥网络中启动新的客户端容器时使用，则该客户端容器可以通过专用网络接口访问公开的端口。如网络概述中--link所述在用户定义的网络中启动容器时使用，它将为要链接的容器提供命名别名。

### **19.4 ENV（环境变量）**

创建Linux容器时，Docker会自动设置一些环境变量。创建Windows容器时，Docker不会设置任何环境变量。

为Linux容器设置了以下环境变量：

变量 | 值
HOME | 根据设定值 USER
HOSTNAME | 与容器关联的主机名
PATH | 包括热门目录，例如 /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
TERM | xterm 如果为容器分配了伪TTY

此外，操作员可以使用一个或多个标志设置容器中的任何环境变量-e，甚至覆盖上面提到的标志，或者由开发人员使用Dockerfile定义ENV。如果操作员在没有指定值的情况下命名环境变量，则命名变量的当前值将传播到容器的

环境中：

    $ export today=Wednesday
    $ docker run -e "deep=purple" -e today --rm alpine env
    
    PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    HOSTNAME=d2219b854598
    deep=purple
    today=Wednesday
    HOME=/root
    PS C:\> docker run --rm -e "foo=bar" microsoft/nanoserver cmd /s /c set
    ALLUSERSPROFILE=C:\ProgramData
    APPDATA=C:\Users\ContainerAdministrator\AppData\Roaming
    CommonProgramFiles=C:\Program Files\Common Files
    CommonProgramFiles(x86)=C:\Program Files (x86)\Common Files
    CommonProgramW6432=C:\Program Files\Common Files
    COMPUTERNAME=C2FAEFCC8253
    ComSpec=C:\Windows\system32\cmd.exe
    foo=bar
    LOCALAPPDATA=C:\Users\ContainerAdministrator\AppData\Local
    NUMBER_OF_PROCESSORS=8
    OS=Windows_NT
    Path=C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Users\ContainerAdministrator\AppData\Local\Microsoft\WindowsApps
    PATHEXT=.COM;.EXE;.BAT;.CMD
    PROCESSOR_ARCHITECTURE=AMD64
    PROCESSOR_IDENTIFIER=Intel64 Family 6 Model 62 Stepping 4, GenuineIntel
    PROCESSOR_LEVEL=6
    PROCESSOR_REVISION=3e04
    ProgramData=C:\ProgramData
    ProgramFiles=C:\Program Files
    ProgramFiles(x86)=C:\Program Files (x86)
    ProgramW6432=C:\Program Files
    PROMPT=$P$G
    PUBLIC=C:\Users\Public
    SystemDrive=C:
    SystemRoot=C:\Windows
    TEMP=C:\Users\ContainerAdministrator\AppData\Local\Temp
    TMP=C:\Users\ContainerAdministrator\AppData\Local\Temp
    USERDOMAIN=User Manager
    USERNAME=ContainerAdministrator
    USERPROFILE=C:\Users\ContainerAdministrator
    windir=C:\Windows

同样，操作员可以使用设置HOSTNAME（Linux）或COMPUTERNAME（Windows）-h。

### **19.5 HEALTHCHECK**

      --health-cmd            Command to run to check health
      --health-interval       Time between running the check
      --health-retries        Consecutive failures needed to report unhealthy
      --health-timeout        Maximum time to allow one check to run
      --health-start-period   Start period for the container to initialize before starting health-retries countdown
      --no-healthcheck        Disable any container-specified HEALTHCHECK


例：


    $ docker run --name=test -d \
        --health-cmd='stat /etc/passwd || exit 1' \
        --health-interval=2s \
        busybox sleep 1d
    $ sleep 2; docker inspect --format='{{.State.Health.Status}}' test
    healthy
    $ docker exec test rm /etc/passwd
    $ sleep 2; docker inspect --format='{{json .State.Health}}' test
    {
      "Status": "unhealthy",
      "FailingStreak": 3,
      "Log": [
        {
          "Start": "2016-05-25T17:22:04.635478668Z",
          "End": "2016-05-25T17:22:04.7272552Z",
          "ExitCode": 0,
          "Output": "  File: /etc/passwd\n  Size: 334       \tBlocks: 8          IO Block: 4096   regular file\nDevice: 32h/50d\tInode: 12          Links: 1\nAccess: (0664/-rw-rw-r--)  Uid: (    0/    root)   Gid: (    0/    root)\nAccess: 2015-12-05 22:05:32.000000000\nModify: 2015..."
        },
        {
          "Start": "2016-05-25T17:22:06.732900633Z",
          "End": "2016-05-25T17:22:06.822168935Z",
          "ExitCode": 0,
          "Output": "  File: /etc/passwd\n  Size: 334       \tBlocks: 8          IO Block: 4096   regular file\nDevice: 32h/50d\tInode: 12          Links: 1\nAccess: (0664/-rw-rw-r--)  Uid: (    0/    root)   Gid: (    0/    root)\nAccess: 2015-12-05 22:05:32.000000000\nModify: 2015..."
        },
        {
          "Start": "2016-05-25T17:22:08.823956535Z",
          "End": "2016-05-25T17:22:08.897359124Z",
          "ExitCode": 1,
          "Output": "stat: can't stat '/etc/passwd': No such file or directory\n"
        },
        {
          "Start": "2016-05-25T17:22:10.898802931Z",
          "End": "2016-05-25T17:22:10.969631866Z",
          "ExitCode": 1,
          "Output": "stat: can't stat '/etc/passwd': No such file or directory\n"
        },
        {
          "Start": "2016-05-25T17:22:12.971033523Z",
          "End": "2016-05-25T17:22:13.082015516Z",
          "ExitCode": 1,
          "Output": "stat: can't stat '/etc/passwd': No such file or directory\n"
        }
      ]
    }

健康状态也会显示在docker ps输出中。

### **19.6 TMPFS（挂载tmpfs文件系统）**

    --tmpfs=[]: Create a tmpfs mount with: container-dir[:<options>],
                where the options are identical to the Linux
                'mount -t tmpfs -o' command.


下面安装一个空的tmpfs与容器中的例子rw， noexec，nosuid，和size=65536k选项。

    $ docker run -d --tmpfs /run:rw,noexec,nosuid,size=65536k my_image


### **19.7 VOLUME（共享文件系统）**

    -v, --volume=[host-src:]container-dest[:<options>]: Bind mount a volume.
    The comma-delimited `options` are [rw|ro], [z|Z],
    [[r]shared|[r]slave|[r]private], and [nocopy].
    The 'host-src' is an absolute path or a name value.
    
    If neither 'rw' or 'ro' is specified then the volume is mounted in
    read-write mode.
    
    The `nocopy` mode is used to disable automatically copying the requested volume
    path in the container to the volume storage location.
    For named volumes, `copy` is the default mode. Copy modes are not supported
    for bind-mounted volumes.
    
    --volumes-from="": Mount all volumes from the given container(s)

注意

使用systemd管理Docker守护程序的启动和停止时，在systemd单元文件中有一个选项来控制Docker守护程序本身的挂载传播MountFlags。此设置的值可能会导致Docker无法看到在安装点上进行的安装传播更改。例如，如果此值为slave，则可能无法在卷上使用shared或rshared传播。

卷命令足够复杂，可以在“ 使用卷”部分中拥有自己的文档。开发人员可以定义一个或多个VOLUME与镜像关联的对象，但是只有操作员才能从一个容器访问另一个容器（或从一个容器访问安装在主机上的卷）。

在container-dest必须始终是绝对路径，例如/src/docs。的host-src可以是一个绝对路径或name值。如果您提供的绝对路径，则host-dirDocker绑定安装到您指定的路径。如果提供a name，则Docker将以此创建一个命名卷name。

甲name值必须以字母数字字符，接着启动a-z0-9，_（下划线）， .（周期）或-（连字符）。绝对路径以/（正斜杠）开头。

例如，您可以指定一个/foo或foo一个host-src值。如果提供该/foo值，则Docker将创建一个绑定安装。如果提供foo规范，则Docker将创建一个命名卷。

### **19.8 USER**

root（id = 0）是容器中的默认用户。镜像开发人员可以创建其他用户。这些用户可以通过名称访问。传递数字ID时，用户不必在容器中。

开发人员可以设置默认用户，以使用Dockerfile USER指令运行第一个进程。启动容器时，操作员可以USER通过传递-u选项来覆盖指令。

    -u="", --user="": Sets the username or UID used and optionally the groupname or GID for the specified command.
    
    The followings examples are all valid:
    --user=[ user | user:group | uid | uid:gid | user:gid | uid:group ]

注意：如果您传递数字uid，则它必须在0-2147483647的范围内。

### **19.10 WORKDIR** 

在容器中运行二进制文件的默认工作目录是根目录（/），但是开发人员可以使用Dockerfile WORKDIR命令设置其他默认目录。操作员可以使用以下方法覆盖它：

    -w="": Working directory inside the container
