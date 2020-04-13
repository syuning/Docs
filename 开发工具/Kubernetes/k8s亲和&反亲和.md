# 将Pods分配到指定节点

您可以将**Pod**限制为只能在特定的节点或集群上运行，有几种方法可以做到这一点，通常推荐使用“标签选择器label selectors”进行选择。 大部分情况下，此类约束是不必要的，因为调度程序会自动进行合理的放置（例如，将Pod分散到节点上，而不将Pod放置在可用资源不足的节点上，等等），但是在某些情况下，您可能需要更多控制着陆的节点：例如确保将Pod安装在连接了SSD的机器上，或将来自两个不同服务的Pod放置在同一位置，这些操作都服务需要大量通信。

## nodeSelector 节点选择器

`nodeSelector` 是推荐的节点选择约束形式中最简单的一个。
`nodeSelector` 是PodSpec的一个字段，它指定了一个键值对的映射。为了使Pod可以在节点上运行，该节点必须包含所有指定的键值对作为标签（它也可以具有其他标签）。最常见的用法是只指定一对键值对。

### 步骤 0: 先决条件

需要先安装好Kubernetes集群。

### 步骤 1: 为到节点标记标签

执行 `kubectl get nodes` 获取当前所有集群节点的名字。选取想要标记的节点，执行 `kubectl label nodes <node-name> <label-key>=<label-value>` 施加标签。
例：若要为节点名称为'kubernetes-foo-node-1.c.a-robinson.internal'的节点施加值为'disktype=ssd'的标签，则运行`kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`。

您可以通过重新运行`kubectl get nodes --show-labels`来检查该节点现在是否拥有标签，或使用`kubectl describe node "nodename"`来查看指定节点标签的完整列表。

### 步骤 2: 为你的pod配置文件添加一个nodeSelector字段

向要运行的Pod配置文件内添加一个nodeSelector部分，例如下列pod配置：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
```

添加后结果如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  nodeSelector:
    disktype: ssd
```

之后运行`kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml`时，该Pod将在标签附加到的节点上进行调度。
您可以通过运行`kubectl get pods -o wide`并查看分配给Pod的“NODE”来验证它是否有效。

## 内置的节点标签

除了您附加的标签外，节点还预先填充了一组标准标签，它们是：

* [`kubernetes.io/hostname`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-hostname)
* [`failure-domain.beta.kubernetes.io/zone`](/docs/reference/kubernetes-api/labels-annotations-taints/#failure-domain-beta-kubernetes-io-zone)
* [`failure-domain.beta.kubernetes.io/region`](/docs/reference/kubernetes-api/labels-annotations-taints/#failure-domain-beta-kubernetes-io-region)
* [`beta.kubernetes.io/instance-type`](/docs/reference/kubernetes-api/labels-annotations-taints/#beta-kubernetes-io-instance-type)
* [`kubernetes.io/os`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-os)
* [`kubernetes.io/arch`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-arch)

这些标签的值是云提供商指定的，不保证可靠。 例如，在某些环境下，`kubernetes.io/hostname`的值可能与节点名称相同，而在其他环境下的值可能不同。

## 节点隔离/限制

向节点对象添加标签可以将pods定位到特定的节点或节点组，这可以用来确保特定的Pod仅在具有一定隔离性、安全性或监管属性的节点上运行。

当为此目的使用标签时，强烈建议选择节点上的kubelet进程无法修改的标签键，这样可以防止受感染的节点使用其kubelet凭据在自己的Node对象上设置这些标签，并影响调度程序将工作负载调度到受感染的节点。

`NodeRestriction`许可插件可防止kubelet设置或修改带有`node-restriction.kubernetes.io/`前缀的标签。

在使用该标签前缀进行节点隔离之前：

1. 检查Kubernetes版本是否等于或高于v1.11，以使用NodeRestriction。
2. 确保您使用的是Node Authorizer，并且已启用NodeRestriction许可插件。
3. 在`node-restriction.kubernetes.io/`前缀下的标签上添加到节点对象，并在节点选择器中使用这些标签。
例如`example.com.node-restriction.kubernetes.io/fips=true`或`example.com.node-restriction.kubernetes.io/pci-dss=true`。

## 亲和性和反亲和性

`nodeSelector`提供了一种非常简单的方法来将pod约束到带有特定标签的节点上，而亲和性/反亲和性极大地扩展了可以表达的约束类型。

主要区别为：

1. 语言更具表现力（不仅仅是只能完全匹配的“AND”）
2. 您可以指出规则是"soft"/"preference"而不是硬要求，因此如果调度程序无法满足要求，pod仍会被安排
3. 您可以限制节点（或其他拓扑域）上运行的其他Pod上的标签，而不是针对节点本身上的标签，这允许有关哪些容器可以或不能一起放置的规则

亲和性特征包括两种类型，即“节点亲和性”和“pod间亲和性/反亲和性”。节点亲和性类似于现有的`nodeSelector`，但具有上面列出的前两个好处；而Pod间亲和性/反亲和性则针对Pod标签而不是节点标签进行约束，除了具有上面列出的第一和第二属性外，还具有上面列出的第三项属性。

### 节点亲和性

节点亲和性在概念上与`nodeSelector`类似-它使您可以根据节点上的标签来限制Pod可以在哪些节点上进行调度。

当前有两种节点亲和性，分别是`requiredDuringSchedulingIgnoredDuringExecution`和`preferredDuringSchedulingIgnoredDuringExecution`。
您可以将它们分别认为是"hard"和"soft"，在某种意义上，前者指定了*必须*满足将Pod调度到节点上的规则（就像`nodeSelector`，但使用了更具表现力的语法 ），而后者指定的*preferences*，调度程序将尝试执行，但不能保证。

"IgnoredDuringExecution"部分意味着，类似于`nodeSelector`，如果节点上的标签在运行时发生更改，从而不再满足Pod上的亲和性规则，该pod仍将继续在该节点上运行。
将来，我们计划提供`requiredDuringSchedulingRequiredDuringExecution`，它与`requiredDuringSchedulingIgnoredDuringExecution`一样，不同之处在于，它将不再满足Pod节点亲和性要求的节点中退出Pod。

`requiredDuringSchedulingIgnoredDuringExecution`示例：“仅在装有Intel CPU的节点上运行Pod”。
`preferredDuringSchedulingIgnoredDuringExecution`示例：“尝试在故障区域XYZ中运行这组Pod，若不可能，则允许在其他地方运行某些Pods”。

节点亲和性在PodSpec中指定为`affinity`的 `nodeAffinity`字段。

下面是使用节点亲和性的pod的示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/e2e-az-name
            operator: In
            values:
            - e2e-az1
            - e2e-az2
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: another-node-label-key
            operator: In
            values:
            - another-node-label-value
  containers:
  - name: with-node-affinity
    image: k8s.gcr.io/pause:2.0
```

该节点亲和性规则表示，只能将Pod放置在标签为`kubernetes.io/e2e-az-name`且标签值为`e2e-az1`或`e2e-az2`的节点上。 另外，在满足该标准的所有节点中，标签键为`another-node-label-key`且标签值为`another-node-label-value`的节点应该是首选。

您可以在示例中看到使用的运算符“ In”。 新的节点亲和性语法支持以下运算符： `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`。

您可以使用`NotIn`和`DoesNotExist`来实现节点的反亲和行为，或者使用节点污点来排斥特定节点的Pod。

如果同时指定`nodeSelector`和`nodeAffinity`，则必须同时满足“两个”条件，才能将Pod调度到候选节点上。

如果您指定多个与`nodeAffinity`类型相关联的`nodeSelectorTerms`，且`nodeSelectorTerms`之一得到满足，则可以将pod调度到一个节点上。

如果您指定与`nodeSelectorTerms`相关联的多个`matchExpressions`，若**满足所有**`matchExpressions`时，可以将pod调度到一个节点上。

如果删除或更改安排了pod的节点的标签，该pod并不会被删除。换句话说，亲和性选择仅在安排pod时有效。

`preferredDuringSchedulingIgnoredDuringExecution`中的`weight`字段的范围为1-100。对于满足所有调度要求（资源请求，RequiredDuringScheduling亲和关系表达式等）的节点，若该节点匹配对应的MatchExpressions，调度程序将通过遍历此字段的元素来计算总和，并在该总和中添加“权重weight”。然后将该分数与该节点的其他优先级函数的分数组合，总得分最高的节点是最优选的。

### pod间亲和性和反亲和性

容器间亲和性和反亲和性使您可以基于*已经在节点上运行的pods的标签*，而非基于节点上的标签，来限制哪些节点可以调度您的pod。
规则的形式为“如果X已经有一个或多个满足规则Y的Pods正在运行，则在应满足亲和性情况时，该Pod应该在X中运行；或在应满足反亲和性的情况下时，该Pod不应在X中运行”。

Y是用带有可选的命名空间列表的LabelSelector来表示的；
与节点不同，由于Pod是带有命名空间的（因此Pod上的标签也是隐式含有命名空间的），所以Pod标签上的标签选择器必须指定选择器应应用于哪个命名空间。
从概念上讲，X是一个与节点、机架、云服务商zone或云供应商region类似的拓扑域。
您可以使用`topologyKey`来表示它，它是系统用来表示这种拓扑域的节点标签的密钥，例如 请参阅“内置节点标签”一节中上面列出的标签键。

{{< note >}}
容器间亲和性和反亲和性需要大量计算资源，这可能会大大减慢大型群集中的调度效率。 我们不建议在多余几百个节点的大型群集中使用它们。
{{< /note >}}

{{< note >}}
Pod的反亲和力要求对节点进行一致的标记，即集群中的每个节点都必须具有与`topologyKey`相匹配的合适的标签。 如果其中某些节点或所有节点都缺少指定的`topologyKey`标签，则可能导致意外发生。
{{< /note >}}

与节点亲和性一样，当前有Pod亲和性和反亲和性两种类型，分别称为`requiredDuringSchedulingIgnoredDuringExecution`和`preferredDuringSchedulingIgnoredDuringExecution`，分别表示“硬”与“软”要求。
请参阅前面的节点亲和性部分中的描述。

`requiredDuringSchedulingIgnoredDuringExecution`亲和性的一个示例是“将服务A和服务B的Pods放置在同一区域，因为它们之间需要进行频繁交流”；
而`preferredDuringSchedulingIgnoredDuringExecution`反亲和性的示例是“将此服务的Pods分散放置在整个区域中”，由于pods是数量是有可能多余区域的数量的，因此该约束可能不合理。

pod间亲和性在PodSpec中指定为字段`affinity`字段中的`podAffinity`字段。
在PodSpec中，pod间反亲和性指定为字段`affinity`字段中的`podAntiAffinity`字段。

#### An example of a pod that uses pod affinity:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: security
            operator: In
            values:
            - S1
        topologyKey: failure-domain.beta.kubernetes.io/zone
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: security
              operator: In
              values:
              - S2
          topologyKey: failure-domain.beta.kubernetes.io/zone
  containers:
  - name: with-pod-affinity
    image: k8s.gcr.io/pause:2.0
```

在这个示例中，此Pod上的亲和性定义了一个Pod亲和性规则和一个Pod反亲和性规则。其中，亲和性规则`podAffinity`是`requiredDuringSchedulingIgnoredDuringExecution`，反亲和性规则`podAntiAffinity`是`preferredDuringSchedulingIgnoredDuringExecution`。

根据pod亲和性规则，仅当该节点与至少一个已运行的、拥有标签键为"security"且标签值为“S1”的标签的pod处于同一zone时，才能将该pod调度到该节点上。（更确切地说，如果节点N的标签键为`failure-domain.beta.kubernetes.io/zone`和任意标签值V，则pod可以在节点N上运行。这样，集群中至少有一个节点具有标签键 `failure-domain.beta.kubernetes.io/zone`和标签值V，并且正在运行具有标签键为"security"和标签值"S1"的Pod。）
根据pod反亲和规则，如果某节点已经在运行带有标签键"security"和标签值"S2"的pod，则该pod不应该被调度到该节点上。（如果`topologyKey`为`failure-domain.beta.kubernetes.io/zone`，则意味着如果某节点与带有标签键"security"以及标签值"S2"的pod位于同一区域，则该pod无法调度到该节点上 。）

See the [design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md) for many more examples of pod affinity and anti-affinity, both the `requiredDuringSchedulingIgnoredDuringExecution` flavor and the `preferredDuringSchedulingIgnoredDuringExecution` flavor.

Pod亲和性和反亲和性的合法运算符包括`In`, `NotIn`, `Exists`和`DoesNotExist`。

原则上，`topologyKey`可以是任何合法的标签键，然而，出于性能和安全性原因，`topologyKey`将受到一些限制：

1. 对于亲和性和`requiredDuringSchedulingIgnoredDuringExecution` pod反亲和性，不允许使用空的`topologyKey`。
2. 对于`requiredDuringSchedulingIgnoredDuringExecution`pod反亲和，引入了准入控制器(admission controller)`LimitPodHardAntiAffinityTopology`，以将`topologyKey`限制为`kubernetes.io/hostname`。 如果要使其可用于自定义拓扑，则可以修改准入控制器(admission controller)，或直接禁用它。
3. 对于`preferredDuringSchedulingIgnoredDuringExecution`pod反亲和，空的`topologyKey`被视为“所有拓扑”（“所有拓扑”现在仅限于`kubernetes.io/hostname`, `failure-domain.beta.kubernetes.io/zone` 和 `failure-domain.beta.kubernetes.io/region`了）。
4. 除上述情况外，`topologyKey`可以是任何合法的标签键。

除了`labelSelector`和`topologyKey`之外，您还可以指定一个匹配`labelSelector`的命名空间列表`namespaces`，此选项与`labelSelector`以及`topologyKey`同级。若此选项被省略或为空，则使用默认值：出现亲和/反亲和定义的pod的命名空间。

与`requiredDuringSchedulingIgnoredDuringExecution`相似性和反相似性相关联的所有`matchExpressions`都必须满足将Pod调度到节点上的要求。

#### More Practical Use-cases

Interpod Affinity and AntiAffinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc.  One can easily configure that a set of workloads should
be co-located in the same defined topology, eg., the same node.

##### Always co-located in the same node

In a three node cluster, a web application has in-memory cache such as redis. We want the web-servers to be co-located with the cache as much as possible.

Here is the yaml snippet of a simple redis deployment with three replicas and selector label `app=store`. The deployment has `PodAntiAffinity` configured to ensure the scheduler does not co-locate replicas on a single node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

The below yaml snippet of the webserver deployment has `podAntiAffinity` and `podAffinity` configured. This informs the scheduler that all its replicas are to be co-located with pods that have selector label `app=store`. This will also ensure that each web-server replica does not co-locate on a single node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.12-alpine
```

If we create the above two deployments, our three node cluster should look like below.

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

As you can see, all the 3 replicas of the `web-server` are automatically co-located with the cache as expected.

```
kubectl get pods -o wide
```
The output is similar to this:
```
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

##### Never co-located in the same node

The above example uses `PodAntiAffinity` rule with `topologyKey: "kubernetes.io/hostname"` to deploy the redis cluster so that
no two instances are located on the same host.
See [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high availability, using the same technique.

## nodeName

`nodeName` is the simplest form of node selection constraint, but due
to its limitations it is typically not used.  `nodeName` is a field of
PodSpec.  If it is non-empty, the scheduler ignores the pod and the
kubelet running on the named node tries to run the pod.  Thus, if
`nodeName` is provided in the PodSpec, it takes precedence over the
above methods for node selection.

Some of the limitations of using `nodeName` to select nodes are:

-   If the named node does not exist, the pod will not be run, and in
    some cases may be automatically deleted.
-   If the named node does not have the resources to accommodate the
    pod, the pod will fail and its reason will indicate why,
    e.g. OutOfmemory or OutOfcpu.
-   Node names in cloud environments are not always predictable or
    stable.

Here is an example of a pod config file using the `nodeName` field:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

The above pod will run on the node kube-01.

{{% /capture %}}

{{% capture whatsnext %}}

[Taints](/docs/concepts/configuration/taint-and-toleration/) allow a Node to *repel* a set of Pods.

The design documents for
[node affinity](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)
and for [inter-pod affinity/anti-affinity](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md) contain extra background information about these features.

Once a Pod is assigned to a Node, the kubelet runs the Pod and allocates node-local resources.
The [topology manager](/docs/tasks/administer-cluster/topology-manager/) can take part in node-level
resource allocation decisions. 

{{% /capture %}}
