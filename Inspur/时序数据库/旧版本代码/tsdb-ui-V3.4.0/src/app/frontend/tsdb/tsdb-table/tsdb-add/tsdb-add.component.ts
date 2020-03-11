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
      console.log('查询产品详情（用于获取区域列表）！', response.message
      // , response.result.productLineList[0].productTypeList[0].regionList
      );
      this.regions = response.result.productLineList[0].productTypeList[0].regionList;
    });
  }

  verifyUser() {
    this.bssService.userVerification(this.userId).subscribe(
      response => {
        this.isVerified = response.data;
        console.log('验证用户是否实名认证！', response.message
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
    const id = uuid();
    console.log('提交订单！流水号：', id);
    // this.bssService.downloadPto(this.generateTsdbOrderPto(id));
    this.purchaseTsdb(this.generateTsdbOrderPto(id));
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
      console.log('查询当前用户'
      //  + userId
        + '总配额！', response.message
        // , response
        );
      if (response.result !== null) {
        this.quota = response.result.quotaList[0].totalNumber;
        this.current = response.result.quotaList[0].leftNumber;
      } else {
        // 未查到用户配额，暂设用户配额为0
        this.quota = 1;
        this.current = 1;
      }
      this.loading = false;
    });
  }

  // 算费接口
  calculateCost(pto: any) {
    this.loading = true;
    this.bssService.calculateCost(pto).subscribe(response => {
      console.log('算费！', response.message
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

  // 提交订单接口
  purchaseTsdb(pto: any) {
    this.loading = true;
    this.bssService.confirmOrder(pto).subscribe(response => {
      this.loading = false;
      if (response.result !== null && response.result.key !== null) {
        this.loading = true;
        window.location.href = Environment.application.bssFront + '/order/confirm/' + response.result.key;
      }
      console.log('提交订单！', response.message
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

  generateTsdbOrderPto(uuid: string) {
    const tsdbConsoleCustomization = new TsdbConsoleCustomization;
    tsdbConsoleCustomization.instanceName = this.tsdbCreateForm.get('db_name').value;
    tsdbConsoleCustomization.instancePassword = this.tsdbCreateForm.get('password').value;
    tsdbConsoleCustomization.planCode = this.tsdbCreateForm.get('spec').value.planCode;
    const pto = this.bssService.generateTsdbOrderPto(
        this.userId, this.cookiesService.getCookie('inspur_token'), uuid, this.tsdbCreateForm.get('billingMode').value, 'new', this.cost,
        this.tsdbCreateForm.get('duration').value, 'H', this.tsdbCreateForm.get('isAutoRenew').value, tsdbConsoleCustomization,
        this.tsdbCreateForm.get('region').value, this.tsdbCreateForm.get('purchase_num').value,
        this.tsdbCreateForm.get('spec').value.dataPoint, this.tsdbCreateForm.get('storage_size').value
      );
      return pto;
  }

  initCost() {
    this.calculateCost(this.generateTsdbOrderPto(''));
  }

  // 选择套餐
  usePackage(spec: any) {
    if (spec.dataPoint === '50000') {
      this.storage_size = 80;
      this.storage_size_min = 80;
    }
    this.calculateCost(this.generateTsdbOrderPto(''));
    console.log('选择套餐' + this.tsdbCreateForm.get('spec').value.dataPoint + '！',
    //  this.tsdbCreateForm.value
     );
  }

  // 变更存储空间
  diskChange() {
    this.calculateCost(this.generateTsdbOrderPto(''));
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

