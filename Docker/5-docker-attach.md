@贝蒂:unicorn:的文档
> 官方文档地址：https://docs.docker.com/engine/reference/commandline/attach/

# docker attach

## **描述**

将本地的 **标准输入STDIN** 、 **输出STDOUT** 和 **错误流STDERR** 附加到正在运行的容器。

## **用法**

    docker attach [OPTIONS] CONTAINER

## **扩展说明**

 ```docker attach``` 使用**容器的ID**或**名称**，将终端的**标准输入、输出和错误（或这三种的任意组合）**附加到正在运行的容器上，这使您可以查看其正在进行的输出、或以交互方式控制它，就像命令直接在您的终端中运行一样。

> 注意： 该attach命令将显示ENTRYPOINT/CMD进程的输出。实际上，当进程不与终端进行交互时，看起来可能会像是挂起了attach命令。

您可以从 **Docker主机上的不同会话** 同时多次链接到 **同一个容器进程** 。

若要停止容器，请使用 ```CTRL-c``` ，该命令将会发送 ***SIGKILL*** 到容器。若 ```--sig-proxy``` 为 ***true***（默认值） ，则 ```CTRL-ca``` 将会发送 **SIGINT** 到容器。如果使用 ```-i``` 和 ```-t``` 来运行容器，则可以断掉容器的链接，并使用 ```CTRL-p CTRL-q``` 键序列使其仍然保持保持运行状态。

> 注意： **Linux** 会特别处理在容器内 **以PID 1运行的进程** ：它会忽略所有默认signal，因此，该过程不会被 ```SIGINT``` 或者 ```SIGTERM``` 终止，除非代码指定他们应该被终止。

当使用 ```-t``` 启用了一个tty容器时，禁止将attach的标准输入**重定向**到其他地方。

当使用 ```docker attach``` 将客户端连接到容器的 **stdio** 时，Docker使用约1MB的内存缓冲区来最大化应用程序的吞吐量，如果该缓冲区已满，则API连接的速度将开始对进程输出的写入速度产生影响，类似于SSH之类的其他应用程序。因此，不建议运行依赖于性能的应用程序，这些应用程序通过缓慢的客户端连接，在前台生成了大量的输出。因此，用户应使用 ```docker logs``` 命令来访问日志。

### **覆盖 detach sequence**

如果需要，您可以通过配置将 key sequence 覆盖，来进行 **detach**（将attach的终端和容器进行分离），此方法适用于 Docker默认sequence 与您用于其他应用程序的 key sequence 冲突的情况下。定义您自己的**detach key sequence**的方法有两种，一种是按容器覆盖，另一种是整个配置中的配置属性。

使用 ```--detach-keys="<sequence>"``` 来覆盖 **单个容器的sequence**，请在 ```docker attach``` 命令中使用该标志，<sequence>的格式为 ```任意字母[a-Z]``` ，或 ```ctrl-``` 与以下任意一项的组合：

* a-z （单个小写字母字符）
* @ （在标志处）
* [ （左括号）
* \\ （两个反斜杠）
* _ （下划线）
* ^ （插入符号）

## **选项**

名称/简写 | 默认 | 描述
----- | ----- | -----
```--detach-keys``` |  | 覆盖分离容器的 key sequence
```--no-stdin``` |  | 不要链接 STDIN
```--sig-proxy``` | ```true``` | 代理所有接收到的信号到进程

## **例子**

### **链接到正在运行的容器、从容器中分离 （attach & detach）**

    $ docker run -d --name topdemo ubuntu /usr/bin/top -b
    
    $ docker attach topdemo

    top - 02:05:52 up  3:05,  0 users,  load average: 0.01, 0.02, 0.05
    Tasks:   1 total,   1 running,   0 sleeping,   0 stopped,   0 zombie
    Cpu(s):  0.1%us,  0.2%sy,  0.0%ni, 99.7%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
    Mem:    373572k total,   355560k used,    18012k free,    27872k buffers
    Swap:   786428k total,        0k used,   786428k free,   221740k cached
    
    PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND
     1 root      20   0 17200 1116  912 R    0  0.3   0:00.03 top
    
     top - 02:05:55 up  3:05,  0 users,  load average: 0.01, 0.02, 0.05
     Tasks:   1 total,   1 running,   0 sleeping,   0 stopped,   0 zombie
     Cpu(s):  0.0%us,  0.2%sy,  0.0%ni, 99.8%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
     Mem:    373572k total,   355244k used,    18328k free,    27872k buffers
     Swap:   786428k total,        0k used,   786428k free,   221776k cached
    
       PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND
           1 root      20   0 17208 1144  932 R    0  0.3   0:00.03 top
    
    
     top - 02:05:58 up  3:06,  0 users,  load average: 0.01, 0.02, 0.05
     Tasks:   1 total,   1 running,   0 sleeping,   0 stopped,   0 zombie
     Cpu(s):  0.2%us,  0.3%sy,  0.0%ni, 99.5%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
     Mem:    373572k total,   355780k used,    17792k free,    27880k buffers
     Swap:   786428k total,        0k used,   786428k free,   221776k cached
    
     PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND
          1 root      20   0 17208 1144  932 R    0  0.3   0:00.03 top
    ^C$
    
    $ echo $?
    0
    $ docker ps -a | grep topdemo
    
    7998ac8581f9        ubuntu:14.04        "/usr/bin/top -b"   38 seconds ago      Exited (0) 21 seconds ago                          topdemo

### **获取容器命令的退出代码**

在第二个示例中，您可以看到该 **bash** 进程返回的退出代码也由 ```docker attach``` 命令返回给其调用者：

    $ docker run --name test -d -it debian

    275c44472aebd77c926d4527885bb09f2f6db21d878c75f0a1c212c03d3bcfab

    $ docker attach test

    root@f38c87f2a42d:/# exit 13

    exit

    $ echo $?

    13

    $ docker ps -a | grep test

    275c44472aeb        debian:7            "/bin/bash"         26 seconds ago      Exited (13) 17 seconds ago                         test

## **父命令**

命令 | 描述
--- | ---
docker | Docker CLI的基本命令。