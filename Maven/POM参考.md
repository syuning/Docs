源文档地址：https://maven.apache.org/pom.html

# 简单POM示例

```
<project xmlns = “ http://maven.apache.org/POM/4.0.0” 
  xmlns：xsi = “ http://www.w3.org/2001/XMLSchema-instance”
  xsi：schemaLocation = “ http://maven.apache.org/POM/4.0.0
                      http://maven.apache.org/xsd/maven-4.0.0.xsd“ >

  <！-modelVersion指POM版本是必须的，当前Maven2和Maven3只支持4.0.0版本->
  <modelVersion> 4.0.0 </ modelVersion>
 
  <！-基础知识->
  <groupId> ... </ groupId>
  <artifactId> ... </ artifactId>
  <version> ... </ version>
  <packaging> ... </ packaging>
  <dependencies> ... </ dependencies>
  <parent> ... </ parent>
  <dependencyManagement> ... </ dependencyManagement>
  <modules> ... </ modules>
  <properties> ... </ properties>
 
  <！-构建设置->
  <build> ... </ build>
  <reporting> ... </ reporting>
 
  <！-更多项目信息->
  <name> ... </ name>
  <description> ... </ description>
  <url> ... </ url>
  <inceptionYear> ... </ inceptionYear>
  <licenses> ... </ licenses>
  <organization> ... </ organization>
  <developers> ... </ developers>
  <contributors> ... </ contributors>
 
  <！-环境设置->
  <issueManagement> ... </ issueManagement>
  <ciManagement> ... </ ciManagement>
  <mailingLists> ... </ mailingLists>
  <scm> ... </ scm>
  <prerequisites> ... </ prerequisites
  <repositories> ... </ repositories>
  <pluginRepositories> ... </ pluginRepositories>
  <distributionManagement> ... </ distributionManagement>
  <profiles> ... </ profiles>
</ project>
```

# 基础POM（Maven所允许的最小的POM文件）

包括groupId，artifactId和vwesion。

```
<project xmlns = “ http://maven.apache.org/POM/4.0.0” 
  xmlns：xsi = “ http://www.w3.org/2001/XMLSchema-instance”
  xsi：schemaLocation = “ http://maven.apache.org/POM/4.0.0
                      http://maven.apache.org/xsd/maven-4.0.0.xsd“ >
  <modelVersion> 4.0.0 </ modelVersion>
  <groupId> org.codehaus.mojo </ groupId>
  <artifactId>我的项目</ artifactId>
  <version> 1.0 </ version>
</ project>
```

# Maven坐标

上面定义的POM是Maven允许的最小值，groupId:artifactId:version是所有必填字段（不过，如果它们是从父级继承的，则无需显式定义groupId和version-稍后会详细介绍继承性）。这三个字段的作用很像一个地址和一个时间戳。这标记了存储库中的特定位置，就像Maven项目的坐标系一样：

> **groupId**：这在组织或项目中通常是唯一的。例如，所有核心Maven工件都可以（当然应该）位于groupId下org.apache.maven。组ID不一定使用点表示法，例如junit项目。注意，带点号的groupId不必与项目包含的包​​结构相对应。但是，遵循此做法是一种很好的做法。当存储在存储库中时，该组的行为非常类似于Java打包结构在操作系统中的行为。点被操作系统特定的目录分隔符（例如Unix中的“ /”）替换，该分隔符成为基础存储库中的相对目录结构。在给出的示例中，该org.codehaus.mojo组位于目录中$M2_REPO/org/codehaus/mojo。

> **artifactId**：artifactId通常是已知项目的名称。尽管groupId很重要，但是小组中的人们很少在讨论中提及groupId（他们通常都是相同的ID，例如MojoHaus项目的groupId ：）org.codehaus.mojo。它与groupId一起创建了一个密钥，用于将该项目与世界上其他所有项目分开（至少，它应该:)）。与groupId一起，artifactId完全定义了存储库中工件的居住区。对于上述项目，my-project居住在$M2_REPO/org/codehaus/mojo/my-project。

> **version**：这是命名难题的最后一部分。groupId:artifactId表示单个项目，但它们无法描述我们正在谈论的那个项目的具体化身。我们要junit:junit2018年版（4.12版）还是2007年版（3.8.2版）？简而言之：代码更改，这些更改应进行版本控制，并且此元素使这些版本保持一致。它还可以在工件的存储库中使用，以将版本彼此分开。my-project版本1.0文件位于目录结构中$M2_REPO/org/codehaus/mojo/my-project/1.0。

这三个要素上面指向一个项目的特定版本定，让Maven的知道谁我们正在处理，并当在其软件生命周期，我们希望他们。