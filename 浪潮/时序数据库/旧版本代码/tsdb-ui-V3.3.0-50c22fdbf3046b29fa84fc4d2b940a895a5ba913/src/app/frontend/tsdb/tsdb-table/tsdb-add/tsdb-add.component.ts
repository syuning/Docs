import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { TsdbService } from '../../tsdb.service';
import { BssService } from '../../bss.service';
import { UserService } from '@global/shared/user.service';
import { CookiesService } from 'ng-zorro-iop';
import { Environment } from '../../../../../environments/environment';
declare let require: any;

@Component({
  selector: 'app-tsdb-add',
  styleUrls: ['./tsdb-add.component.css'],
  templateUrl: './tsdb-add.component.html',
})
export class TsdbAddComponent implements OnInit {
  @ViewChild('NziFormComponent') NziFormComponent;

  tsdbCreateForm: FormGroup;

  isVerified: boolean;
  regions = [];
  loading = false;
  userId = this.userService.getUserId();
  current: number; // 当前用户拥有的时序数据库总数
  quota: number; // 当前用户的时序数据库总配额
  environment: string;
  environmentId: string;
  subdomain = {
    mode: 'default',
    labelKey: 'label',
    valueKey: 'value',
    datas: []
  };
  specData = [{
      dataPoint: 3000,
      timeSeries: 500000,
      planCode: 'std_3000'
    },
    {
      dataPoint: 10000,
      timeSeries: 1000000,
      planCode: 'std_10000'
    },
    {
      dataPoint: 15000,
      timeSeries: 2000000,
      planCode: 'std_15000'
    },
    {
      dataPoint: 30000,
      timeSeries: 4000000,
      planCode: 'std_30000'
    },
    {
      dataPoint: 50000,
      timeSeries: 8000000,
      planCode: 'std_50000'
    },
  ];
  storage_size = 40;
  storage_size_min = 40;
  storage_size_max = 5000;
  submitted = false;

  cost: number;

  constructor(private fb: FormBuilder, private tsdbService: TsdbService, private nzMessage: NzMessageService,
    private userService: UserService, private bssService: BssService, private cookiesService: CookiesService) {}

  ngOnInit() {
    this.tsdbCreateForm = this.fb.group({
      billingMode: ['hourlySettlement', [Validators.required]], // 付费模式
      region: ['cn-north-3', [Validators.required]], // 区域
      spec: [this.specData[0], [Validators.required]], // 规格
      storage_size: [40, [Validators.required]], // 存储空间
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(32), this.passwordValidator]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(32), this.confirmationValidator]],
      db_name: [this.generateDbName(), [Validators.required, Validators.minLength(2), Validators.maxLength(128), this.tsdbNameValidator]],
      purchase_num: [1, [Validators.required, this.userQuotaValidator]] // 购买数量
    });
    this.generateDbName();
    this.getUserQuota(this.userId, 'cn-north-3', 'TSDB', 'TSDB', 'amount');
    this.initCost();
    this.verifyUser();
    this.getRegions();
  }

  getRegions() {
    this.bssService.getProductDetail(this.userId, 'TSDB', 'TSDB_std').subscribe(response => {
      console.log('查询产品详情（用于获取区域列表）'
      // , response.result.productLineList[0].productTypeList[0].regionList
      );
      this.regions = response.result.productLineList[0].productTypeList[0].regionList;
    });
  }

  verifyUser() {
    this.bssService.userVerification(this.userId).subscribe(
      response => {
        this.isVerified = response.data;
        console.log('验证用户是否实名认证'
        // , response
        );
      });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.tsdbCreateForm.controls.checkPassword.updateValueAndValidity());
  }

  tsdbNameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) { // 不为空
      return {
        required: true
      };
    } else if (!(/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5._-]{2,127}$/).test(control.value)) {
      return {
        invalid: true
      };
    }
  }

  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/).test(control.value)) {
      return {
        invalid: true
      };
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.tsdbCreateForm.controls.confirmPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (control.value !== this.tsdbCreateForm.controls.password.value) {
      return {
        confirm: true,
        error: true
      };
    }
    return {};
  }

  userQuotaValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (this.current < control.value) {
      return {
        invalid: true
      };
    }
  }

  submitForm(): boolean {
    this.submitted = true;
    for (const key in this.tsdbCreateForm.controls) {
      if (this.tsdbCreateForm.controls.hasOwnProperty(key)) {
        this.tsdbCreateForm.controls[key].markAsDirty();
        this.tsdbCreateForm.controls[key].updateValueAndValidity();
      }
    }
    const uuid = require('uuid/v4');
    const pto = { // 用于订单提交
      userId: this.userId,
      token: this.cookiesService.getCookie('inspur_token'),
      orderRoute: 'TSDB',
      setCount: 1,
      consoleOrderFlowId: uuid(), // *订单流水号
      billType: this.tsdbCreateForm.get('billingMode').value,
      orderWhat: 'formal',
      orderType: 'new',
      totalMoney: this.cost,
      duration: 1,
      durationUnit: 'H',
      consoleCustomization: {
        instanceName: this.tsdbCreateForm.get('db_name').value,
        instancePassword: this.tsdbCreateForm.get('password').value,
        planCode: this.tsdbCreateForm.get('spec').value.planCode,
      },
      productList: // * 产品列表
        [{
          region: this.tsdbCreateForm.get('region').value, // * 地域
          productLineCode: 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
          productTypeCode: 'TSDB_std', // * 产品类型 如IO优化型的云服务器
          productName: '通用型时序数据库',
          instanceCount: this.tsdbCreateForm.get('purchase_num').value, // * 单个商品的数量
          itemList: [ // *
            {
              code: 'dataPoint', // *
              name: ' 数据点',
              unit: 'dps/s',
              value: this.tsdbCreateForm.get('spec').value.dataPoint, // (5000, 8000], 1000
              type: 'billingItem'
            },
            {
              code: 'diskVolume', // *
              name: ' 数据盘大小',
              unit: 'GiB',
              value: this.tsdbCreateForm.get('storage_size').value, // (40, 5000], 40
              type: 'billingItem' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              code: 'DBInstanceType',
              name: ' 实例类型',
              unit: '',
              value: 'STD_Instance', // name: 通用型
              type: 'impactFactor' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              code: 'TimeSeries_max',
              name: ' 时间序列数',
              unit: '个',
              value: this.tsdbCreateForm.get('spec').value.timeSeries, // (10000, 300000], 1000
              type: 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            }
          ]
        }]
    };
    // this.tsdbService.downloadPto(pto);
    console.log('表单内容：'
    // , this.tsdbCreateForm.value
    );
    console.log('提交内容：'
    // , pto
    );
    this.purchaseTsdb(pto);
    return this.tsdbCreateForm.valid;
  }

  // 旧接口，直接创建TSDB实例
  createTsdb() {
      const uuid = require('uuid/v4');
      const pto = {
        userId: this.userId,
        token: this.cookiesService.getCookie('inspur_token'),
        orderRoute: 'TSDB',
        setCount: 1,
        consoleOrderFlowId: uuid(), // *订单流水号
        billType: this.tsdbCreateForm.get('billingMode').value,
        orderWhat: 'formal',
        orderType: 'new',
        totalMoney: this.cost,
        duration: 0,
        durationUnit: 'H',
        consoleCustomization: {
          instanceName: this.tsdbCreateForm.get('db_name').value,
          instancePassword: this.tsdbCreateForm.get('password').value,
          planCode: this.tsdbCreateForm.get('spec').value.planCode,
        },
        productList: // * 产品列表
          [{
            region: this.tsdbCreateForm.get('region').value, // * 地域
            productLineCode: 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
            productTypeCode: 'TSDB_std', // * 产品类型 如IO优化型的云服务器
            productName: '通用型时序数据库',
            instanceCount: this.tsdbCreateForm.get('purchase_num').value, // * 单个商品的数量
            itemList: [ // *
              {
                code: 'dataPoint', // *
                name: ' 数据点',
                unit: 'dps/s',
                value: this.tsdbCreateForm.get('spec').value.dataPoint, // (5000, 8000], 1000
                type: 'billingItem'
              },
              {
                code: 'diskVolume', // *
                name: ' 数据盘大小',
                unit: 'GiB',
                value: this.tsdbCreateForm.get('storage_size').value, // (40, 5000], 40
                type: 'billingItem' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
              },
              {
                code: 'DBInstanceType',
                name: ' 实例类型',
                unit: '',
                value: 'STD_Instance', // name: 通用型
                type: 'impactFactor' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
              },
              {
                code: 'TimeSeries_max',
                name: ' 时间序列数',
                unit: '个',
                value: this.tsdbCreateForm.get('spec').value.timeSeries, // (10000, 300000], 1000
                type: 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
              }
            ]
          }]
      };
      // this.tsdbService.downloadPto(pto);
      console.log('创建TSDB提交参数：'
      // , pto
      );
  }

  generateDbName(): string {
    const now = new Date();
    // console.log(now.toJSON().split('-')[1],
    // now.getFullYear() , now.getMonth() , now.getDate() , now.getHours() , now.getMinutes() , now.getSeconds());
    const dbName = 'TSDB-' +
      now.getFullYear().toString() +
      // now.getMonth().toString() +
      now.toJSON().split('-')[1].toString() +
      now.getDate().toString() +
      now.getHours().toString() +
      now.getMinutes().toString() +
      now.getSeconds().toString();
    return dbName;
  }

  // 算费接口
  calculateCost(pto: any) {
    this.loading = true;
    this.bssService.calculateCost(pto).subscribe(response => {
      console.log('算费'
      // , pto, response
      );
      if (response.result !== null && response.result.totalMoney !== null) {
        this.cost = response.result.totalMoney;
        this.loading = false;
      } else {
        this.cost = 3.1415926535897932384626;
        this.loading = false;
      }
    });
  }

  getUserQuota(userId: string, region: string, productLineCode: string, productTypeCode: string, quotaType: string) {
    this.loading = true;
    this.bssService.getUserQuota(userId, region, productLineCode, productTypeCode, quotaType).subscribe(response => {
      console.log('查询当前用户'
      //  + userId
        + '总配额'
        // , response
        );
      if (response.result !== null) {
        this.quota = response.result.quotaList[0].totalNumber;
        this.current = response.result.quotaList[0].leftNumber;
      }
      this.loading = false;
    });
  }

  // 提交订单接口
  purchaseTsdb(pto: any) {
    this.bssService.confirmOrder(pto).subscribe(response => {
      if (response.result !== null && response.result.key !== null) {
        this.loading = true;
        window.location.href = Environment.application.bssFront + '/order/confirm/' + response.result.key;
      }
      console.log('提交订单'
      // , pto, response
      );
      if (response.code === '0') {
        this.nzMessage.loading('订单创建成功，页面跳转中……', {
          nzDuration: 0
        });
      } else {
        this.nzMessage.error('订单创建失败！');
      }
    });
  }

  // TODO
  initCost() {
    const uuid = require('uuid/v4');
    const pto = {
      userId: this.userId,
      token: this.cookiesService.getCookie('inspur_token'),
      orderRoute: 'TSDB',
      setCount: 1,
      consoleOrderFlowId: uuid(), // *订单流水号
      billType: 'hourlySettlement',
      orderWhat: 'formal',
      orderType: 'new',
      totalMoney: 0,
      'productList': // * 产品列表
        [{
          'region': 'cn-north-3', // * 地域
          'productLineCode': 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
          'productTypeCode': 'TSDB_std', // * 产品类型 如IO优化型的云服务器
          'productName': '通用型时序数据库',
          'instanceCount': 1, // * 单个商品的数量
          'itemList': [ // *
            {
              'code': 'dataPoint', // *
              'name': ' 数据点',
              'unit': 'dps/s',
              'value': 3000, // (5000, 8000], 1000
              'type': 'billingItem'
            },
            {
              'code': 'diskVolume', // *
              'name': ' 数据盘大小',
              'unit': 'GiB',
              'value': 40, // (40, 5000], 40
              'type': 'billingItem' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              'code': 'DBInstanceType',
              'name': ' 实例类型',
              'unit': '',
              'value': 'STD_Instance', // name: 通用型
              'type': 'impactFactor' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              'code': 'TimeSeries_max',
              'name': ' 时间序列数',
              'unit': '个',
              'value': 500000, // (10000, 300000], 1000
              'type': 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            }
          ]
        }]
    };
    this.calculateCost(pto);
  }

  usePackage(spec: any) {
    if (spec.dataPoint === '50000') {
      this.storage_size = 80;
      this.storage_size_min = 80;
    }
    const uuid = require('uuid/v4');
    const pto = { // 重新算费
      userId: this.userId,
      token: this.cookiesService.getCookie('inspur_token'),
      orderRoute: 'TSDB',
      setCount: 1,
      consoleOrderFlowId: uuid(), // *订单流水号
      billType: this.tsdbCreateForm.get('billingMode').value,
      orderWhat: 'formal',
      orderType: 'new',
      totalMoney: this.cost,
      'productList': // * 产品列表
        [{
          'region': this.tsdbCreateForm.get('region').value, // * 地域
          // 'availableZone': '', // 可用区编码
          'productLineCode': 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
          'productTypeCode': 'TSDB_std', // * 产品类型 如IO优化型的云服务器
          'productName': '通用型时序数据库',
          'instanceCount': this.tsdbCreateForm.get('purchase_num').value, // * 单个商品的数量
          'itemList': [ // *
            {
              'code': 'dataPoint', // *
              'name': ' 数据点',
              'unit': 'dps/s',
              'value': spec.dataPoint, // (5000, 8000], 1000
              'type': 'billingItem'
            },
            {
              'code': 'diskVolume', // *
              'name': ' 数据盘大小',
              'unit': 'GiB',
              'value': this.storage_size, // (40, 5000], 40
              'type': 'billingItem' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              'code': 'DBInstanceType',
              'name': ' 实例类型',
              'unit': '',
              'value': 'STD_Instance', // name: 通用型
              'type': 'impactFactor' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              'code': 'TimeSeries_max',
              'name': ' 时间序列数',
              'unit': '个',
              'value': spec.timeSeries, // (10000, 300000], 1000
              'type': 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            }
          ]
        }]
    };
    this.calculateCost(pto);
    console.log('选择套餐 ' + this.tsdbCreateForm.get('spec').value.dataPoint,
    //  this.tsdbCreateForm.value
     );
  }

  diskChange(storage_size: number) {
    const uuid = require('uuid/v4');
    const pto = {
      userId: this.userId,
      token: this.cookiesService.getCookie('inspur_token'),
      orderRoute: 'TSDB',
      setCount: 1,
      consoleOrderFlowId: uuid(), // *订单流水号
      billType: this.tsdbCreateForm.get('billingMode').value,
      orderWhat: 'formal',
      orderType: 'new',
      totalMoney: this.cost,
      'productList': // * 产品列表
        [{
          'region': this.tsdbCreateForm.get('region').value, // * 地域
          // 'availableZone': '', // 可用区编码
          'instanceName': this.tsdbCreateForm.get('db_name').value,
          'instancePassword': this.tsdbCreateForm.get('password').value,
          'productLineCode': 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
          'productTypeCode': 'TSDB_std', // * 产品类型 如IO优化型的云服务器
          'productName': '通用型时序数据库',
          'instanceCount': this.tsdbCreateForm.get('purchase_num').value, // * 单个商品的数量
          'itemList': [ // *
            {
              'code': 'dataPoint', // *
              'name': ' 数据点',
              'unit': 'dps/s',
              'value': this.tsdbCreateForm.get('spec').value.dataPoint, // (5000, 8000], 1000
              'type': 'billingItem'
            },
            {
              'code': 'diskVolume', // *
              'name': ' 数据盘大小',
              'unit': 'GiB',
              'value': storage_size, // (40, 5000], 40
              'type': 'billingItem' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              'code': 'DBInstanceType',
              'name': ' 实例类型',
              'unit': '',
              'value': 'STD_Instance', // name: 通用型
              'type': 'impactFactor' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              'code': 'TimeSeries_max',
              'name': ' 时间序列数',
              'unit': '个',
              'value': this.tsdbCreateForm.get('spec').value.timeSeries, // (10000, 300000], 1000
              'type': 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            }
          ]
        }]
    };
    this.calculateCost(pto);
  }

  navToDocumentPage() {
    window.open('/document/tsdb/index.html', '_blank');
  }

}

export class OpenTsdb {
  id: any;
  namespace: string;
  code: any;
  description: any;
  host: any;
  name: string;
}
