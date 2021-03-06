@贝蒂:unicorn:的文档
> 官方文档地址：https://docs.docker.com/engine/reference/commandline/cli/

# ** docker 命令行选项（flag）**

## **1 描述**

要列出所有可用命令，直接运行 ```docker``` 命令（不带任何参数），或执行 ```docker help``` ：

    $ docker
    Usage: docker [OPTIONS] COMMAND [ARG...]
           docker [ --help | -v | --version ]
    
    A self-sufficient runtime for containers.
    
    Options:
          --config string      Location of client config files (default "/root/.docker")
      -c, --context string     Name of the context to use to connect to the daemon (overrides DOCKER_HOST env var and default context set with "docker context use")
      -D, --debug              Enable debug mode
          --help               Print usage
      -H, --host value         Daemon socket(s) to connect to (default [])
      -l, --log-level string   Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")
          --tls                Use TLS; implied by --tlsverify
          --tlscacert string   Trust certs signed only by this CA (default "/root/.docker/ca.pem")
          --tlscert string     Path to TLS certificate file (default "/root/.docker/cert.pem")
          --tlskey string      Path to TLS key file (default "/root/.docker/key.pem")
          --tlsverify          Use TLS and verify the remote
      -v, --version            Print version information and quit
    
    Commands:
        attach    Attach to a running container
        # […]


> **说明**：根据您的Docker系统配置，可能需要在每个docker命令前加上**sudo**。为了避免使用**sudo**，系统管理员可以创建一个名为 ```docker``` 的**Unix用户组** ，并在其中添加用户。有关安装Docker或sudo配置的更多信息，请参阅您操作系统的安装说明。

## **2 环境变量**

为便于参考，docker命令行支持以下环境变量列表：

* **DOCKER_API_VERSION**：要使用的API版本（例如1.19）
* **DOCKER_CONFIG**：客户端配置文件的位置。
* **DOCKER_CERT_PATH**：身份验证密钥的位置。
* **DOCKER_CLI_EXPERIMENTAL**：启用cli的实验功能（例如enabled或disabled）
* **DOCKER_DRIVER**：要使用的图形驱动程序。
* **DOCKER_HOST**：要连接的 Daemon socket。
* **DOCKER_NOWARN_KERNEL_VERSION**：防止警告您的Linux内核不适合Docker。
* **DOCKER_RAMDISK**：配置此项将会禁用“pivot_root”。
* **DOCKER_STACK_ORCHESTRATOR**：配置使用docker stack管理命令时要使用的默认协调器。
* **DOCKER_TLS**：设置后，Docker使用TLS。
* **DOCKER_TLS_VERIFY**：设置后，Docker使用TLS并验证远程。
* **DOCKER_CONTENT_TRUST**：设置后，Docker将使用公证人对镜像进行签名和验证。等同--disable-content-trust=false于构建，创建，拉动，推动，运行。
* **DOCKER_CONTENT_TRUST_SERVER**：要使用的公证服务器的URL。默认情况下，该URL与注册表相同。
* **DOCKER_HIDE_LEGACY_COMMANDS**：设置后，Docker 在输出中隐藏“旧式”顶级命令（例如docker rm和 docker pull）docker help，并且仅打印Management commands每个对象类型（例如docker container）。这可能会成为将来版本中的默认值，届时将删除此环境变量。
* **DOCKER_TMPDIR**：临时Docker文件的位置。
* **DOCKER_CONTEXT**：指定要使用的上下文（使用“ docker context use”覆盖DOCKER_HOST env var和默认上下文集）
* **DOCKER_DEFAULT_PLATFORM**：为带有--platform标志的命令指定默认平台。

由于Docker是使用Go开发的，因此您还可以使用Go运行时使用的任何环境变量。特别是，您可能会发现以下有用：
    
* **HTTP_PROXY**
* **HTTPS_PROXY**
* **NO_PROXY**

这些Go环境变量不区分大小写。有关这些变量的详细信息，请参见 Go规范。

### **2.1 配置文件**

默认情况下，Docker命令行将其配置文件存储在目录.docker内的$HOME目录中。

Docker管理配置目录中的大多数文件不应被修改，但是，您可以通过修改 config.json 文件以控制部分 docker 命令行为。

您可以使用环境变量或命令行选项来修改docker的命令行为，您还可以使用 config.json 中的选项来修改某些相同的行为。如果同时设置了环境变量和--config选项，则该--config选项优先于环境变量。

> ***docker配置的优先级排名**：命令行选项(flag) > 环境变量 > config.json*

### **2.2 更改 .docker 路径**

要指定其他目录，请使用 ***DOCKER_CONFIG*** 环境变量或 **--config** 命令行选项。如果两者都指定，则该 **--config** 选项将覆盖 ***DOCKER_CONFIG*** 环境变量。

下面的示例 ```docker ps``` 使用目录中的 ```config.json``` 文件覆盖命令 ```~/testconfigs/``` 。

    $ docker --config ~/testconfigs/ ps

该flag仅适用于正在运行的命令，对于持久性配置，可以在shell（例如~/.profile或~/.bashrc）中设置环境变量 ***DOCKER_CONFIG*** 。

下面的示例将新目录设置为 ```HOME/newdir/.docker``` 。

    echo export DOCKER_CONFIG=$HOME/newdir/.docker > ~/.profile

### **2.3 config.json 配置文件**

```config.json``` 配置文件以 **JSON编码** 存储了以下几个属性：

***HttpHeaders***
指定一组包含所有从Docker客户端发送到守护程序的所有消息的headers。
Docker不会尝试解释或理解这些headers，它只是将它们放入消息中。Docker不允许这些headers自行更改docker为它们设置的任何内容。

***psFormat***
指定docker ps输出的默认格式。
当docker ps命令未提供--format标志时，Docker客户端将使用 ***psFormat*** 属性。如果未设置此属性，则客户端将回退到默认表格式。有关受支持的格式指令的列表，请参见 docker ps 的文档中的“格式”部分。

***imagesFormat***
指定docker images输出的默认格式，当命令--format未提供该标志时docker images，Docker的客户端使用此属性。如果未设置此属性，则客户端将回退到默认表格式。有关受支持的格式指令的列表，请参见 docker images 文档中的“格式”部分。

***pluginsFormat***
指定docker plugin ls输出的默认格式，当docker plugin ls命令未提供--format标志时，Docker客户端将使用  ***pluginsFormat*** 属性。如果未设置此属性，则客户端将回退到默认表格式。有关受支持的格式指令的列表，请参见 docker plugin ls 文档中的“格式”部分。

***servicesFormat***
指定docker service ls输出的默认格式，当命令 docker service ls未提供--format标志时，Docker的客户端使用 ***servicesFormat*** 属性。如果未设置此属性，则客户端将使用默认的json格式。有关受支持的格式指令的列表，请参见 docker service ls 文档中的“格式”部分。

***serviceInspectFormat***
指定docker service inspect输出的默认格式。
当命令--format未提供该标志时 docker service inspect，Docker的客户端使用此属性。如果未设置此属性，则客户端将使用默认的json格式。有关受支持的格式指令的列表，请参见 docker service inspect 文档中的“格式”部分。

***statsFormat***
指定docker stats输出的默认格式。
当命令--format未提供该标志时 docker stats，Docker的客户端使用此属性。如果未设置此属性，则客户端将回退到默认表格式。有关受支持的格式设置指令的列表，请参见 docker stats 文档中的“格式设置”部分

***secretFormat***
指定docker secret ls输出的默认格式。
当命令--format未提供该标志时 docker secret ls，Docker的客户端使用此属性。如果未设置此属性，则客户端将回退到默认表格式。有关受支持的格式设置指令的列表，请参见 docker secret ls 文档中的“格式设置”部分

***nodesFormat***
指定docker node ls输出的默认格式。
当命令--format未提供该标志时docker node ls，Docker的客户端使用的值nodesFormat。如果nodesFormat未设置的值，则客户端将使用默认表格式。有关受支持的格式指令的列表，请参见 docker node ls 文档中的“格式”部分。

***configFormat***
指定docker config ls输出的默认格式。
当命令--format未提供该标志时 docker config ls，Docker的客户端使用此属性。如果未设置此属性，则客户端将回退到默认表格式。有关受支持的格式设置指令的列表，请参见 docker config ls 文档中的“格式设置”部分

***credsStore***
指定一个外部二进制文件作为默认凭据存储。
设置此属性后，docker login将尝试将凭据存储在指定的二进制文件中，docker-credential-<value>该二进制文件在上可见$PATH。如果未设置此属性，则凭据将存储在auths配置的属性中。有关更多信息，请参见 docker login 文档中的“凭据存储”部分。

***credHelpers***
指定一组凭据帮助者，它们优先于credsStore或auths在存储和检索特定注册表的凭据时使用。
如果设置了此属性，则docker-credential-<value>在存储或检索特定注册表的凭据时将使用二进制文件 。有关更多信息，请参见 docker login 文档中的“凭据帮助器”部分。

***stackOrchestrator***
指定运行docker stack管理命令时要使用的默认协调器，可以是"swarm"， "kubernetes"或"all"。可以使用DOCKER_STACK_ORCHESTRATOR环境变量或--orchestrator标志覆盖此属性。

***proxies***
指定代理环境变量，该变量将在容器上自动设置，并设置为--build-arg在期间使用的容器docker build。
"default"可以配置一组代理，并将其用于客户端连接到的任何docker守护程序，或每个主机的配置（docker守护程序），例如“ https://docker-daemon1.example.com”。可以为每个环境设置以下属性：

* httpProxy（设定的值HTTP_PROXY和http_proxy）
* httpsProxy（设定的值HTTPS_PROXY和https_proxy）
* ftpProxy（设定的值FTP_PROXY和ftp_proxy）
* noProxy（设定的值NO_PROXY和no_proxy）

> 警告：代理设置可能包含敏感信息（例如，如果代理需要身份验证）。环境变量以纯文本格式存储在容器的配置中，因此可以通过远程API进行检查，或者在使用时将其提交到镜像docker commit。

一旦连接到容器，用户就可以从容器中分离出来，并使用using CTRL-p CTRL-q键序列使其保持运行状态。此分离键序列可使用detachKeys属性进行自定义。<sequence>为属性指定一个值。的格式<sequence>是字母[aZ]或ctrl-以下任意一项的逗号分隔列表：

* a-z （单个小写字母字符）
* @ （在标志处）
* [ （左括号）
* \\ （两个反斜杠）
* _ （下划线）
* ^ （插入符号）

您的定制适用于以Docker客户端启动的所有容器。用户可以在每个容器的基础上覆盖您的自定义键或默认键序列。要做到这一点，用户指定--detach-keys旗docker attach，docker exec，docker run或docker start命令。

该属性plugins包含特定于CLI插件的设置。关键是插件名称，而值是该插件特有的选项的进一步映射。

以下是一个示例config.json文件：

    {
      "HttpHeaders": {
        "MyHeader": "MyValue"
      },
      "psFormat": "table {{.ID}}\\t{{.Image}}\\t{{.Command}}\\t{{.Labels}}",
      "imagesFormat": "table {{.ID}}\\t{{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}",
      "pluginsFormat": "table {{.ID}}\t{{.Name}}\t{{.Enabled}}",
      "statsFormat": "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}",
      "servicesFormat": "table {{.ID}}\t{{.Name}}\t{{.Mode}}",
      "secretFormat": "table {{.ID}}\t{{.Name}}\t{{.CreatedAt}}\t{{.UpdatedAt}}",
      "configFormat": "table {{.ID}}\t{{.Name}}\t{{.CreatedAt}}\t{{.UpdatedAt}}",
      "serviceInspectFormat": "pretty",
      "nodesFormat": "table {{.ID}}\t{{.Hostname}}\t{{.Availability}}",
      "detachKeys": "ctrl-e,e",
      "credsStore": "secretservice",
      "credHelpers": {
        "awesomereg.example.org": "hip-star",
        "unicorn.example.com": "vcbait"
      },
      "stackOrchestrator": "kubernetes",
      "plugins": {
        "plugin1": {
          "option": "value"
        },
        "plugin2": {
          "anotheroption": "anothervalue",
          "athirdoption": "athirdvalue"
        }
      },
      "proxies": {
        "default": {
          "httpProxy":  "http://user:pass@example.com:3128",
          "httpsProxy": "http://user:pass@example.com:3128",
          "noProxy":    "http://user:pass@example.com:3128",
          "ftpProxy":   "http://user:pass@example.com:3128"
        },
        "https://manager1.mycorp.example.com:2377": {
          "httpProxy":  "http://user:pass@example.com:3128",
          "httpsProxy": "http://user:pass@example.com:3128"
        },
      }
    }

### **2.4 还在试验中的功能**

实验功能提供了对未来产品功能的早期访问。这些功能仅用于测试和反馈，因为它们可能在版本之间更改而不会发出警告，或者可以从将来的版本中完全删除。

实验功能不得在生产环境中使用。

要启用实验功能，请编辑config.json文件并设置experimental为enabled。

下面的示例在config.json已经启用调试功能的文件中启用实验功能。

    {
      "experimental": "enabled",
      "debug": true
    }

您还可以从Docker Desktop菜单启用实验性功能。

### **2.5 notary**

如果使用自己的公证服务器和自签名证书或内部证书颁发机构，则需要将证书放在 tls/<registry_url>/ca.crtdocker config目录中。

或者，您可以通过将证书添加到系统的根证书颁发机构列表中来全局信任该证书。

## **3 示例**

### 3.1 显示帮助文本

要列出任何命令的帮助，只需执行该命令，然后执行该 --help选项即可。

    $ docker run --help
    
    Usage: docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
    
    Run a command in a new container
    
    Options:
          --add-host value             Add a custom host-to-IP mapping (host:ip) (default [])
      -a, --attach value               Attach to STDIN, STDOUT or STDERR (default [])
    ...

### 3.2 选项类型

单个字符的命令行选项是可以合并的，因此docker run -i -t --name test busybox sh 可以简化为 docker run -it --name test busybox sh。

#### 3.2.1 BOOLEAN

布尔选项采用形式-d=false。您在帮助文本中看到的值是默认值，如果您未指定该标志，则会设置该默认值。如果您指定不带值的布尔值标志，则无论默认值如何，都将标志设置为true。

例如，运行docker run -d会将值设置为true，因此您的容器将在后台以独立(Detached)模式运行。

默认为true（例如docker build --rm=true）的选项只能通过将其显式设置为来设置为非默认值false：

    $ docker build --rm=false .

#### 3.2.2 MUILTI

您可以在单个命令行中多次指定-a=[]之类的选项，例如：

    $ docker run -a stdin -a stdout -i -t ubuntu /bin/bash
    
    $ docker run -a stdin -a stdout -a stderr ubuntu /bin/ls

有时，多个选项可能会要求更复杂的值字符串，例如 -v：

    $ docker run -v /host:/container example/mysql

> 注意：由于实施限制，请勿一起使用-t和-a stderr选项pty。所有stderr的pty模式简单地去stdout。

#### 3.2.3 STRINGS 和 INTEGERS

像--name=""字符串这样的选项，只能指定一次。诸如-c=0 整数之类的选项只能指定一次。