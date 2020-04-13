import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { TsdbService } from '../../tsdb.service';
import { BssService } from '../../bss.service';
import { UserService } from '@global/shared/user.service';
import { CookiesService } from 'ng-zorro-iop';
import { Environment } from '../../../../../environments/environment';
import { subdomain, specData, durationList } from '../../consts';
declare let require: any;

export class TsdbConsoleCustomization {
  instanceName: string;
  instancePassword: string;
  duration: number;
  durationUnit: string;
  planCode: string;
}

@Component({
  selector: 'app-tsdb-add',
  styleUrls: ['./tsdb-add.component.css'],
  templateUrl: './tsdb-add.component.html',
})
export class TsdbAddComponent implements OnInit {
  @ViewChild('NziFormComponent') NziFormComponent;
  subdomain = subdomain;
  specData = specData;
  durationList = durationList;

  tsdbCreateForm: FormGroup;

  isVerified: boolean;
  regions = [];
  loading = false;
  userId = this.userService.getUserId();
  current: number; // 当前用户拥有的时序数据库总数
  quota: number; // 当前用户的时序数据库总配额
  environment: string;
  environmentId: string;

  storage_size = 40;
  storage_size_min = 40;
  storage_size_max = 5000;
  submitted = false;

  totalMoney: number;
  actualMoney: number;

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
      duration: ['1', [Validators.required]],
      isAutoRenew: [false], // 是否自动续费
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
      if (response.status === 200) {
        this.regions = response.body.result.productLineList[0].productTypeList[0].regionList;
      }

      // 控制台信息
      console.log('查询产品详情（用于获取区域列表）！' + response.statusText + ' ' + response.status);
    });
  }

  verifyUser() {
    this.bssService.userVerification(this.userId).subscribe(
      response => {
        this.isVerified = response.body.data;
      // 控制台信息
      console.log('验证用户是否实名认证！' + response.statusText + ' ' + response.status);
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
    // } else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/).test(control.value)) {
    } else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!%\-\.\'\$\+\|\^\'\{\}\[\]\@,"/:;<=>?_-~]{8,12}$/).test(control.value)) {
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
    if (this.tsdbCreateForm.status === 'INVALID') {
      return false;
    }

    // if (this.tsdbCreateForm.status == "INVALID") {
    //   return false;
    // }
    const uuid = require('uuid/v4');
    const id = uuid();
    console.log('提交订单！流水号：', id);
    // this.bssService.downloadPto(this.generateTsdbOrderPto(id));
    this.purchaseTsdb(this.generateTsdbOrderPto(id, 'new', ''));
    return this.tsdbCreateForm.valid;
  }

  generateDbName(): string {
    const now = new Date();
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

  // 获取用户配额
  getUserQuota(userId: string, region: string, productLineCode: string, productTypeCode: string, quotaType: string) {
    this.loading = true;
    this.bssService.getUserQuota(userId, region, productLineCode, productTypeCode, quotaType).subscribe(response => {
      if (response.status === 200) {
        this.quota = response.body.result.quotaList[0].totalNumber;
        this.current = response.body.result.quotaList[0].leftNumber;
      } else {
        // 未查到用户配额，暂设用户配额为0
        this.quota = 0;
        this.current = 0;
      }
      this.loading = false;

      // 控制台信息
      console.log('查询用户配额！' + response.statusText + ' ' + response.status);
    });
  }

  // 算费接口
  calculateCost(pto: any) {
    this.loading = true;
    this.bssService.calculateCost(pto).subscribe(response => {
      if (response.result !== (undefined || null) && response.result.totalMoney !== (undefined || null)) {
        this.totalMoney = response.result.totalMoney;
        this.actualMoney = response.result.actualMoney;
        this.loading = false;
      } else {
        this.totalMoney = 3.1415926535897932384626;
        this.actualMoney = 3.1415926535897932384626;
        this.loading = false;
      }

      // 控制台信息
      console.log('算费');
    });
  }

  // 提交订单接口
  purchaseTsdb(pto: any) {
    this.loading = true;
    this.bssService.confirmOrder(pto).subscribe(response => {
      this.loading = false;
      if (response.result !== undefined && response.result.key !== null) {
        this.loading = true;
        window.location.href = Environment.application.bssFront + '/order/confirm/' + response.result.key;
      }
      if (response.code === '0') {
        this.nzMessage.loading('订单创建成功，页面跳转中……', {
          nzDuration: 0
        });
      } else {
        this.nzMessage.error('订单创建失败！');
      }

      // 控制台信息
      console.log('提交订单！' + response.statusText + response.status);
    });
  }

  generateTsdbOrderPto(uuid: string, orderTye: string, tsdbId: string) {
    let durationUnit: string;
    if (this.tsdbCreateForm.get('billingMode').value === 'hourlySettlement') {
      durationUnit = 'H';
    } else if (this.tsdbCreateForm.get('billingMode').value === 'monthly') {
      durationUnit = 'M';
    }
    const tsdbConsoleCustomization = new TsdbConsoleCustomization;
    tsdbConsoleCustomization.instanceName = this.tsdbCreateForm.get('db_name').value;
    tsdbConsoleCustomization.instancePassword = this.tsdbCreateForm.get('password').value;
    tsdbConsoleCustomization.duration = this.tsdbCreateForm.get('duration').value;
    tsdbConsoleCustomization.durationUnit = durationUnit;
    tsdbConsoleCustomization.planCode = this.tsdbCreateForm.get('spec').value.planCode;
    const pto = this.bssService.generateTsdbOrderPto(
        this.userId, this.cookiesService.getCookie('inspur_token'), uuid, this.tsdbCreateForm.get('billingMode').value, orderTye,
        this.actualMoney, this.tsdbCreateForm.get('duration').value, durationUnit, this.tsdbCreateForm.get('isAutoRenew').value,
        tsdbConsoleCustomization, this.tsdbCreateForm.get('region').value, this.tsdbCreateForm.get('purchase_num').value,
        this.tsdbCreateForm.get('spec').value.dataPoint, this.tsdbCreateForm.get('storage_size').value, tsdbId
      );
      // this.bssService.downloadPto(pto);
      return pto;
  }

  initCost() {
    this.calculateCost(this.generateTsdbOrderPto('', 'new', ''));
  }

  // 选择套餐
  usePackage(spec: any) {
    if (spec.dataPoint === '50000') {
      this.storage_size = 80;
      this.storage_size_min = 80;
    }
    this.calculateCost(this.generateTsdbOrderPto('', 'new', ''));
    console.log('选择套餐' + this.tsdbCreateForm.get('spec').value.dataPoint,
    //  this.tsdbCreateForm.value
     );
  }

  // 变更存储空间
  diskChange() {
    this.calculateCost(this.generateTsdbOrderPto('', 'new', ''));
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

