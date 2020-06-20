@贝蒂 :unicorn: 的文档
> 官网文档地址：https://docs.docker.com/engine/reference/run/

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

### **4.1 容器名称 [--name]**

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

## **7. IPC设置（--ipc）（IPC：Inter-Process Communication，进程间通信**

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
// TODO

## **11. 清理容器**
// TODO

## **12. 安全配置**
// TODO

## **13. 设定初始进程**
// TODO

## **14. 设置自定义的cgroup**
// TODO

## **15. 资源的运行时刻约束**
// TODO

## **16. 附加组**
// TODO

## **17. 运行时刻特权以及Linux性能**
// TODO

## **18. 日志驱动**
// TODO

## **19. 覆盖Dockerfile镜像默认值**
// TODO





docker run -itd -p 127.0.0.1:50001:22 centos /bin/bash