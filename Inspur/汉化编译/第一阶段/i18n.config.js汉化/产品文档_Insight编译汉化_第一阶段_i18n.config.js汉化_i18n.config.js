/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('ambariAdminConsole')
.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en',{
    'CLUSTER.ADMINISTRATOR': '可操作',
    'CLUSTER.USER': '只读',
    'VIEW.USER': '使用',

    'common': {
      'ambari': 'Insight HD',
      'apacheAmbari': 'InCloud Insight HD Manager',
      'about': '关于',
      'version': '版本 4.0',
      'signOut': '退出',
      'register':'注册',
      'clusters': '集群',
      'views': '视图',
      'viewUrls': '视图URL',
      'roles': '角色',
      'users': '用户',
      'groups': '组',
      'versions': '版本',
      'stack': '软件栈',
      'details': '详情',
      'goToDashboard': '进入控制台',
      'noClusters': '暂无集群',
      'noViews': '暂无视图',
      'view': '视图',
      'displayLabel': '显示标签',
      'search': '查找',
      'name': '名称',
      'any': '所有',
      'none': '无',
      'type': '类型',
      'add': '添加 {{term}}',
      'delete': '删除 {{term}}',
      'deregisterCluster': '取消注册',
      'cannotDelete': '无法删除 {{term}}',
      'privileges': '权限',
      'cluster': '集群',
      'remoteClusters': '远程集群',
      'services':'服务',
      'clusterRole': '集群角色',
      'viewPermissions': '视图权限',
      'getInvolved': '联系我们！',
      'license': '© 2016 Inspur. All Rights Reserved.',
      'tableFilterMessage': '{{showed}} of {{total}} {{term}} showing',
      'yes': '确定',
      'no': '取消',
      'renameCluster': '集群重命名',
      'renameClusterTip': '只能使用字母数字字符，最多80个字符',
      'clusterCreationInProgress': '集群创建中...',
      'userGroupManagement': '用户+组管理',
      'all': '所有',
      'group': '组',
      'user': '用户',
      'settings': '设置',
      'authentication': '认证',
      'deleteConfirmation': '确定要删除 {{instanceType}} {{instanceName}}?',
      'remoteClusterDelConfirmation':'确定要删除 {{instanceType}} {{instanceName}}? 此操作无法撤消。',
      'messageInstanceAffected':'以下View实例正在使用此远程集群进行配置，并需要重新配置：{{viewInstance}}',
      'local': '本地',
      'pam': 'PAM',
      'ldap': 'LDAP',
      'jwt': 'JWT',
      'warning': '警告',
      'filterInfo': '{{showed}} of {{total}} {{term}} showing',
      'usersGroups': '用户/组',
      'enabled': '启用',
      'disabled': '禁用',
      'NA': 'n/a',
      'blockViewLabel': 'BLOCK',
      'listViewLabel': 'LIST',
      'rbac': '基于角色的访问控制',
      'important': '重要',
      'undo': '撤消',
      'fromGroupMark': '(from group)',

      'clusterNameChangeConfirmation': {
        'title': '确认集群名称更改',
        'message': '您确定要将集群名称更改为{{clusterName}}吗？'
      },

      'loginActivities': {
        'loginActivities':'登录活动',
        'loginMessage': '登录消息',
        'loginMessage.placeholder': '请输入登录信息',
        'buttonText.placeholder': '请输入按钮文本',
        'homeDirectory': '主目录',
        'notEmpty': '这些字段不能为空',
        'saveError': '保存错误',
        'message': '消息',
        'buttonText': '按钮',
        'status': '状态',
        'status.disabled': '禁用',
        'homeDirectory.alert': '许多Ambari视图在HDFS中将用户行为存储在登录的用户/用户目录中。或者，Ambari可以在登录时为用户自动创建这些目录。',
        'homeDirectory.autoCreate': '自动创建HDFS用户目录',
        'homeDirectory.header': '用户目录创建选项',
        'homeDirectory.template': '用户目录创建模板',
        'homeDirectory.group': '默认组',
        'homeDirectory.permissions': '权限'
      },

      'controls': {
        'cancel': '取消',
        'close': '关闭',
        'ok': '确定',
        'save': '保存',
        'clearFilters': '清除',
        'confirmChange': '确认更改',
        'discard': '丢弃',
        'remove': '移除',
        'update':'更新',
        'checkAll': '检查全部',
        'clearAll': '清除全部'
      },

      'alerts': {
        'fieldRequired': '必填项',
        'fieldIsRequired': '这是必填项。',
        'noSpecialChars': '不能包含特殊字符！',
        'nothingToDisplay': '无 {{term}} 展示。',
        'noRemoteClusterDisplay':'无要显示的远程集群。',
        'noPrivileges': '无 {{term}} 权限',
        'noPrivilegesDescription': ' {{term}} 没有任何权限。',
        'timeOut': '由于闲置，您会在 <b>{{time}}</b> 秒内自动退出。',
        'isInvalid': '{{term}} 无效',
        'cannotSavePermissions': '无法保存权限',
        'cannotLoadPrivileges': '无法加载权限',
        'cannotLoadClusterStatus': '无法加载集群状态',
        'clusterRenamed': '集群已重命名为 {{clusterName}}.',
        'remoteClusterRegistered': '集群已注册为 {{clusterName}}.',
        'cannotRenameCluster': '无法将集群重命名为 {{clusterName}}',
        'minimumTwoChars': '最小长度为2个字符。',
        'maxTwentyFiveChars': '最大长度为25个字符。',
        'onlyText': '只允许使用小写字母数字字符。',
        'onlyAnScore': '输入无效，只允许使用字母数字，例如：My_default_view',
        'passwordRequired':'要求输入密码',
        'unsavedChanges': '您有未储存的变更。 保存更改或丢弃？'
      }
    },

    'main': {
      'title': '欢迎来到Insight HD',
      'noClusterDescription': '设置集群，管理谁可以访问集群，以及自定义用户视图。',
      'hasClusterDescription': '监控集群资源，管理谁可以访问集群，以及自定义用户视图。',
      'autoLogOut': '自动注销',

      'operateCluster': {
        'title': '操作集群',
        'description': '管理集群的配置并监视服务的运行状况',
        'manageRoles': '管理角色'
      },

      'createCluster': {
        'title': '创建集群',
        'description': '使用安装向导选择服务并配置集群',
        'launchInstallWizard': '启动安装向导'
      },

      'manageUsersAndGroups': {
        'title': '管理用户+组',
        'description': '管理可以访问Insight HD Manager的用户和组'
      },

      'deployViews': {
        'title': '部署视图',
        'description': '创建视图实例并授予权限'
      },

      'controls': {
        'remainLoggedIn': '保持登录',
        'logOut': '现在注销'
      }
    },

    'views': {
      'instance': '实例',
      'viewInstance': '视图实例',
      'create': '创建实例',
      'createViewInstance': '创建视图实例',
      'edit': '编辑',
      'viewName': '视图名称',
      'instances': '实例',
      'instanceName': '实例名称',
      'instanceId': '实例ID',
      'displayName': '显示名称',
      'settings': '设置',
      'advanced': '高级',
      'visible': '可见',
      'description': '描述',
      'shortUrl':'短链接',
      'instanceDescription': '实例说明',
      'clusterConfiguration': '集群配置',
      'localCluster': '本地集群',
      'remoteCluster': '远程集群',
      'registerRemoteCluster' : '注册远程集群',
      'clusterName': '集群名称',
      'custom': '自定义',
      'icon': 'Icon',
      'icon64': 'Icon64',
      'permissions': '权限',
      'permission': '权限',
      'grantUsers': '为用户授权',
      'grantGroups': '为组授权',
      'configuration': '配置',
      'goToInstance': '进入实例',
      'pending': '挂起中...',
      'deploying': '部署中...',
      'properties': '属性',
      'urlDelete':'删除URL',

      'clusterPermissions': {
        'label': '本地集群权限',
        'clusteradministrator': '集群管理',
        'clusteroperator': '集群操作',
        'clusteruser': '集群用户',
        'serviceadministrator': '服务管理',
        'serviceoperator': '服务操作',
        'infoMessage': '为以下<strong>{{cluster}}</strong>角色授予<strong>使用</strong>权限：',
        'nonLocalClusterMessage': '根据集群角色继承视图<strong>使用</strong>权限的功能仅在使用本地群集配置时可用。'
      },

      'alerts': {
        'noSpecialChars': '不能包含任何特殊字符。',
        'noSpecialCharsOrSpaces': '不能包含任何特殊字符或空格。',
        'instanceExists': '具有此名称的实例已存在。',
        'notDefined': '没有为此数据视图定义{{term}}。',
        'cannotEditInstance': '无法编辑静态实例',
        'cannotDeleteStaticInstance': '无法删除静态实例',
        'deployError': '部署时出错。 检查Ambari服务器日志。',
        'unableToCreate': '无法创建视图实例',
        'cannotUseOption': '此视图不能使用此选项',
        'unableToResetErrorMessage': '无法重置prop的错误消息： {{key}}',
        'instanceCreated': '已创建的视图实例 {{instanceName}}',
        'unableToParseError': '无法解析错误消息： {{message}}',
        'cannotCreateInstance': '无法创建实例',
        'cannotLoadInstanceInfo': '无法加载实例信息',
        'cannotLoadPermissions': '无法加载权限',
        'cannotSaveSettings': '无法保存设置',
        'cannotSaveProperties': '无法保存属性',
        'cannotDeleteInstance': '无法删除实例',
        'cannotLoadViews': '无法加载视图',
        'cannotLoadViewUrls': '无法加载视图URL',
        'cannotLoadViewUrl': '无法加载视图URL',
        'savedRemoteClusterInformation':'将保存远程集群信息。',
        'credentialsUpdated':'证书已更新。'
      }
    },

    'urls':{
      'name':'名称',
      'url':'URL',
      'viewUrls':'视图URL',
      'createNewUrl':'创建新的URL',
      'create':'创建',
      'edit':'编辑',
      'view':'视图',
      'viewInstance':'实例',
      'step1':'创建URL',
      'step2':'选择实例',
      'step3':'指定URL',
      'noUrlsToDisplay':'无URL显示。',
      'noViewInstances':'没有视图实例',
      'none':'无',
      'change':'更改',
      'urlCreated':'创建短URL <a href="{{siteRoot}}#/main/view/{{viewName}}/{{shortUrl}}">{{urlName}}</a>',
      'urlUpdated':'更新短URL <a href="{{siteRoot}}#/main/view/{{viewName}}/{{shortUrl}}">{{urlName}}</a>'
    },

    'clusters': {
      'switchToList': '切换到LIST视图',
      'switchToBlock': '切换到BLOCK视图',
      'role': '角色',
      'assignRoles': '将角色分配给这些{{term}}',

      'alerts': {
        'cannotLoadClusterData': '无法加载集群数据'
      }
    },

    'groups': {
      'createLocal': '创建本地组',
      'name': '组名称',
      'members': '成员',
      'membersPlural': '{{n}} member{{n == 1 ? "" : "s"}}',

      'alerts': {
        'onlySimpleChars': '必须只包含简单字符。',
        'groupCreated': '创建组 <a href="#/groups/{{groupName}}/edit">{{groupName}}</a>',
        'groupCreationError': '组创建错误',
        'cannotUpdateGroupMembers': '无法更新组成员',
        'getGroupsListError': '获取组列表错误'
      }
    },

    'users': {
      'username': '用户名',
      'userName': '用户名',
      'admin': '管理员',
      'ambariAdmin': 'Manager管理员',
      'ambariClusterURL':'Manager集群URL',
      'changePassword': '修改密码',
      'updateCredentials':'更新票据',
      'changePasswordFor': '为 {{userName}} 修改密码',
      'yourPassword': '旧密码',
      'newPassword': '新密码',
      'newPasswordConfirmation': '新密码确认',
      'create': '创建本地用户',
      'active': '活跃',
      'inactive': '非活跃',
      'status': '状态',
      'password': '密码',
      'passwordConfirmation': '密码确认',
      'userIsAdmin': '此用户为管理员并拥有所有权限。',
      'showAll': '显示所有用户',
      'showAdmin': '只显示管理员用户',
      'groupMembership': '组成员',
      'userNameTip': '最大长度是80个字符，不允许出现：\\, &, |, <, >, ` 这些字符。',

      'changeStatusConfirmation': {
        'title': '更改状态',
        'message': '确定要将用户 "{{userName}}" 的状态更改为{{status}}吗？'
      },

      'changePrivilegeConfirmation': {
        'title': '更改管理权限',
        'message': '您确定要对用户 "{{userName}}" 使用{{action}}管理员权限吗？'
      },

      'roles': {
        'clusterUser': '集群用户',
        'clusterAdministrator': '集群管理员',
        'clusterOperator': '集群操作员',
        'serviceAdministrator': '服务管理员',
        'serviceOperator': '服务操作员',
        'ambariAdmin': 'Manager管理员',
        'viewUser': '视图用户',
        'none': '无',
        'oneRolePerUserOrGroup': '每个组/用户只能出现一个角色',
        'permissionLevel': '{{level}}级别的权限'
      },

      'alerts': {
        'passwordRequired': '要求输入密码',
        'wrongPassword': '密码必须匹配！',
        'usernameRequired':'用户名必需',
        'cannotChange': '无法更改 {{term}}',
        'userCreated': '创建用户 <a href="#/users/{{encUserName}}">{{userName}}</a>',
        'userCreationError': '用户创建错误',
        'removeUserError': '移除组报错',
        'cannotAddUser': '无法将用户添加到组',
        'passwordChanged': '密码已更改。',
        'cannotChangePassword': '无法更改密码',
        'roleChanged': '{{name}}已更改为{{role}}',
        'roleChangedToNone': '{{user_name}}的显式权限已更改为“无”。此用户现在看到的任何权限都通过其组。',
        'usersEffectivePrivilege': '{{user_name}}的有效权限通过其组高于您选择的权限。'
      }
    },

    'versions': {
      'current': '当前',
      'addVersion': '新增版本',
      'defaultVersion': '(默认版本定义)',
      'inUse': '使用中',
      'installed': '已安装',
      'usePublic': "使用公共资源库",
      'networkIssues': {
        'networkLost': "为什么被禁用？",
        'publicDisabledHeader': "已禁用公用资源库选项",
        'publicRepoDisabledMsg': 'Manager无法访问Internet，无法使用公共资源库安装软件。 您的选择：',
        'publicRepoDisabledMsg1': '配置主机以访问Internet。',
        'publicRepoDisabledMsg2': '如果您使用Internet代理，请参阅Manager文档，了解如何配置以使用Internet代理。',
        'publicRepoDisabledMsg3': '使用本地资源库选项。'
      },
      'selectVersion': "选择版本",
      'selectVersionEmpty': "没有其他资源库",
      'useLocal': "使用本地资源库",
      'uploadFile': '上传版本定义文件',
      'enterURL': '版本定义文件URL',
      'defaultURL': 'https://',
      'readInfo': '阅读版本信息',
      'browse': '浏览',
      'installOn': '安装在...',
      'register': {
        'title': '注册版本',
        'error': {
          'header': '无法注册',
          'body': '您正尝试注册具有已在现有注册版本中使用的基本URL的版本。 您*必须*审核您的基本网址，并确认它们是您尝试注册的版本的唯一。'
        }
      },
      'deregister': '注销版本',
      'deregisterConfirmation': '您确定要取消注册版本 <strong>{{versionName}}</strong> ?',
      'placeholder': '版本号 (0.0)',
      'repos': '资源库',
      'os': '操作系统',
      'baseURL': '基本URL',
      'skipValidation': '跳过资源库基本URL验证（高级）',
      'noVersions': '选择版本以显示详细信息。',
      'patch': '补丁',
      'introduction': '要在Manager中注册新版本，请提供版本定义文件，确认软件存储库信息并保存版本。',
      'contents': {
        'title': '内容',
        'empty': '无内容显示'
      },
      'details': {
        'stackName': '软件栈名称',
        'displayName': '显示名称',
        'version': '版本',
        'actualVersion': '实际版本',
        'releaseNotes': '发布说明'
      },
      'repository': {
        'placeholder': '输入基本URL或删除此操作系统'
      },
      'useRedhatSatellite': {
        'title': '使用RedHat Satellite/Spacewalk',
        'warning': '选择 <b>"使用 RedHat Satellite/Spacewalk"</b> 作为软件资源库, ' +
        '您负责配置Satellite/Spacewalk中的资源库通道，并确认所选<b>堆栈版本</b>的存储库在群集中的主机上可用。' +
        '有关详细信息，请参阅文档。',
        'disabledMsg': 'RedHat Satellite/Spacewalk在使用公共资源库时不可用'
      },
      'changeBaseURLConfirmation': {
        'title': '确认基本URL更改',
        'message': '您即将更改已在使用中的资源库基本URL。请确认您打算进行此更改，并且新的基本URL指向相同的确切的堆栈版本和构建'
      },

      'alerts': {
        'baseURLs': '为正在配置的操作系统提供基本URL。',
        'validationFailed': '一些资源库未通过验证。如果您确定URL正确，请更改基本URL或跳过验证',
        'skipValidationWarning': '<b>警告:</b> 这仅适用于高级用户。如果要跳过对资源库基本URL的验证，请使用此选项。',
        'useRedhatSatelliteWarning': '禁用分布式资源库并改用RedHat Satellite/Spacewalk',
        'filterListError': '获取堆栈版本过滤器列表错误',
        'versionCreated': '创建版本 <a href="#/stackVersions/{{stackName}}/{{versionName}}/edit">{{stackName}}-{{versionName}}</a>',
        'versionCreationError': '版本创建错误',
        'allOsAdded': '已添加所有操作系统',
        'osListError': 'getSupportedOSList 错误',
        'readVersionInfoError': '版本定义读取错误',
        'versionEdited': '编辑版本 <a href="#/stackVersions/{{stackName}}/{{versionName}}/edit">{{displayName}}</a>',
        'versionUpdateError': '版本更新错误',
        'versionDeleteError': '版本删除错误'
      }
    },

    'authentication': {
      'description': 'Manager支持针对在Manager数据库中创建和存储的本地用户进行身份验证，或者对LDAP服务器进行身份验证：',
      'ldap': 'LDAP验证',
      'on': '开启',
      'off': '关闭',

      'connectivity': {
        'title': 'LDAP连接配置',
        'host': 'LDAP服务器主机',
        'port': 'LDAP服务器端口',
        'ssl': '使用SSL?',
        'trustStore': {
          'label': '可信赖存储',
          'options': {
            'default': '默认JDK',
            'custom': '自定义'
          }
        },
        'trustStorePath': '可信赖存储路径',
        'trustStoreType': {
          'label': '可信赖存储类型',
          'options': {
            'jks': 'JKS',
            'jceks': 'JCEKS',
            'pkcs12': 'PKCS12'
          }
        },
        'trustStorePassword': '可信赖存储密码',
        'dn': '绑定 DN',
        'bindPassword': '绑定密码',

        'controls': {
          'testConnection': '测试连接'
        }
      },

      'attributes': {
        'title': 'LDAP属性配置',
        'detection': {
          'label': '识别在认证和查找用户和组时要使用的适当属性可以手动指定或自动检测。请选择：',
          'options': {
            'manual': '手动定义属性',
            'auto': '自动检测属性'
          }
        },
        'userSearch': '用户搜索条件',
        'groupSearch': '组搜索条件',
        'detected': '检测到以下属性，请查看并测试属性以确保其准确性。',
        'userObjClass': '用户对象类',
        'userNameAttr': '用户名属性',
        'groupObjClass': '组对象类',
        'groupNameAttr': '组名称属性',
        'groupMemberAttr': '组成员属性',
        'distinguishedNameAttr': '专有名称属性',
        'test': {
          'description': '要快速测试所选属性，请单击下面的按钮。 在此过程中，您可以指定测试用户名和密码，Manager将尝试验证和检索组成员认证信息',
          'username': '测试用户名',
          'password': '测试密码'
        },
        'groupsList': '组列表',

        'controls': {
          'autoDetect': '执行自动检测',
          'testAttrs': '测试属性'
        },

        'alerts': {
          'successfulAuth': '认证成功'
        }
      },

      'controls': {
        'test': '测试'
      }
    }
  });

  $translateProvider.preferredLanguage('en');
}]);
