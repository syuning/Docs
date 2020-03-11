import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@trident/shared';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

import { ClnJobCreateComponent } from '../tsdb-detail/cln-job/cln-job-create/cln-job-create.component';
import { ClnJobComponent } from '../tsdb-detail/cln-job/cln-job.component';
import { TsdbService } from '../../tsdb.service';
import { BssService } from '../../bss.service';
import { CookiesService } from 'ng-zorro-iop';
import 'rxjs/add/operator/switchMap';
import { ClnJobService } from '../../cln-job.service';

@Component({
  selector: 'app-tsdb-detail',
  templateUrl: './tsdb-detail.component.html',
  styleUrls: ['./tsdb-detail.component.css']
})
export class TsdbDetailComponent implements OnInit {

  @ViewChild(ClnJobComponent)
  clnJobComponent: ClnJobComponent;

  loading = true;
  tsdbId = this.activedRoute.snapshot.params['id'];
  tabIndex = this.activedRoute.snapshot.params['tabIndex'];
  userId = this.userService.getUserId();
  detail: any = {};
  editable = false;
  submitValue;
  hasError = false;
  error = null;
  runningTime;

  constructor(private activedRoute: ActivatedRoute, private tsdbService: TsdbService, private clnJobService: ClnJobService,
    private nzMessage: NzMessageService, private bssService: BssService, private userService: UserService,
    private cookiesService: CookiesService, private modalService: NzModalService, private router: Router) {}

  visibleChange() {
    this.submitValue = '';
    this.hasError = false;
    this.error = null;
  }
  valid(value) {
    if (!value) {
      this.hasError = true;
      this.error = {
        required: true
      };
      return false;
    } else if (value.match(/^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5._-]{2,127}$/) == null) { // TSDB名称校验
      this.hasError = true;
      this.error = {
        patten: true
      };
      return false;
    } else {
      this.submitValue = value;
      this.hasError = false;
      this.error = null;
      return true;
    }
  }
  modelChange(value) {
    this.valid(value);
  }
  submit(value) {
    if (!this.hasError) {
      if (!this.submitValue || this.submitValue === value) {
        this.hasError = true;
        this.error = {
          noChange: true
        };
      } else {
        // this.data.name = this.submitValue;
        this.editable = false;
        const mid = this.nzMessage.loading('正在修改中', {
          nzDuration: 0
        }).messageId;
        this.tsdbService.editTsdbName(this.tsdbId, this.submitValue).subscribe(response => {
          console.log('修改TSDB！', response.message
          // , response
          );
          if (this.tsdbService.validateResponseCode(response.code)) {
            this.nzMessage.remove(mid);
            this.nzMessage.success(response.message);
            this.getData(this.tsdbId);
          } else {
            this.nzMessage.remove(mid);
            this.nzMessage.error(response.message);
          }
        });
      }
    }
  }
  getData(id) {
    this.tsdbService.getIndividualTsdb(id).subscribe(response => {
      this.detail = response.result;
      const createTime = new Date(response.result.create_time);
      const now = new Date();
      const ms = (now.valueOf() - createTime.valueOf()); // 毫秒
      if (ms <= 60 * 60 * 1000) { // 一小时以下： xx分钟
        this.runningTime = Math.floor(ms / 1000 / 60) + '分钟';
      } else if ((ms > 60 * 60 * 1000) && (ms <= 60 * 60 * 1000 * 24)) { // 一天以下： xx小时xx分钟
        const h = Math.floor(ms / 1000 / 60 / 60);
        const m = Math.floor((ms - h * 1000 * 60 * 60) / 1000 / 60);
        this.runningTime = h + '小时' + m + '分钟';
      } else if (ms > 60 * 60 * 1000 * 24) { // 高于一天：xx天xx小时xx分钟
        const d = Math.floor(ms / 1000 / 60 / 60 / 24);
        const h = Math.floor((ms - d * 1000 * 60 * 60 * 24) / 1000 / 60 / 60); // 小时
        const m = Math.floor((ms - d * 1000 * 60 * 60 * 24 - h * 1000 * 60 * 60) / 1000 / 60);
        this.runningTime = d + '天' + h + '小时' + m + '分钟';
      }
      console.log('获取TSDB详情！', response.message
      // , response
      );
      this.loading = false;
    });
  }

  addClnJobModal(): void {
    this.modalService.create({
      nzTitle: '清理数据',
      nzContent: ClnJobCreateComponent,
      nzOnOk: (componentInstance) => {
        // console.log(componentInstance.clnJobForm);
        if (componentInstance.clnJobForm.valid) {
          componentInstance.handleCreatingModalOk(this.tsdbId);
          this.loading = true;
          setTimeout(() => {
            this.clnJobComponent.getManualClnJobList();
            this.loading = false;
            return true;
          }, 1000);
        } else {
          this.nzMessage.error('输入参数不合法，请重新输入！');
          return false;
        }
      },
      nzOnCancel: () => console.log('取消')
    });
  }

  showDeleteTsdbModal(data: any) {
    this.modalService.confirm({
      nzTitle: `确定删除时序数据库<em> " ` + data.name + ` " </em>吗？`,
      nzContent: '删除此数据库后，此数据库的用户以及数据信息无法恢复，请谨慎操作！',
      // 删除（释放）成功的时序数据库将会停止计费，未删除（释放）的时序数据库会继续计费。
      nzOnOk: () => this.deleteTsdb(data) ,
      nzOnCancel: () => console.log('取消')
    });
  }
  deleteTsdb(tsdbPto: any): void {
    if (tsdbPto.status === 'CREATE_FAILED') {
      this.tsdbService.deleteTsdb(tsdbPto.id).subscribe(response => {
        const message = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
        if (this.tsdbService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          this.navToHomePage();
        } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message);
        }
      });
    } else {
      const uuid = require('uuid/v4');
      const pto = {
        userId: this.userId,
        token: this.cookiesService.getCookie('inspur_token'),
        orderRoute: 'TSDB',
        setCount: '1',
        consoleOrderFlowId: uuid(), // *订单流水号
        billType: 'hourlySettlement',
        orderWhat: 'formal',
        orderType: 'unsubscribe',
        totalMoney: '0',
        productList: // * 产品列表
          [{
            region: tsdbPto.region, // * 地域
            availableZone: '',
            productLineCode: 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
            productTypeCode: 'TSDB_std', // * 产品类型 如IO优化型的云服务器
            productName: '通用型时序数据库',
            instanceCount: 1, // * 单个商品的数量
            instanceId: tsdbPto.id,
            itemList: [ // *
              {
                code: 'dataPoint', // *
                name: ' 数据点',
                unit: 'dps/s',
                value: tsdbPto.wrt_dp_pers, // (5000, 8000], 1000
                type: 'billingItem'
              },
              {
                code: 'diskVolume', // *
                name: ' 数据盘大小',
                unit: 'GiB',
                value: tsdbPto.storage_size, // (40, 5000], 40
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
                value: tsdbPto.max_dp_num, // (10000, 300000], 1000
                type: 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
              }
            ]
          }]
      };
      // this.tsdbService.downloadPto(pto);
      this.bssService.unsubscribeProduct(pto).subscribe(response => {
        const mid = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
        console.log('提交退订订单！'
        //  + response.message, pto
         );
        if (response.code === '0') {
          this.nzMessage.remove(mid);
          this.nzMessage.success('时序数据库退订成功！');
          setTimeout(() => {this.navToHomePage(); console.log('延时刷新！'); }, 3000);
        }
      });
    }
  }

  navToHomePage() {
    this.router.navigateByUrl('/tsdb/list');
  }

  ngOnInit() {
    this.getData(this.tsdbId);
  }
}
