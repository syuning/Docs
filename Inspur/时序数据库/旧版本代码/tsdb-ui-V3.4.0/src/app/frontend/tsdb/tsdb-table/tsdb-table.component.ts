import {Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NzModalService, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {TsdbService} from '../tsdb.service';
import { BssService } from '../bss.service';
import { UserService, WebsocketService, WSResponseObj } from '@global/shared';
import { CookiesService } from 'ng-zorro-iop';
import { isNullOrUndefined } from 'util';
import {ActivatedRoute, Router} from '@angular/router';
declare let require: any;
import { Environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tsdb-table',
  styleUrls: ['./tsdb-table.component.css'],
  templateUrl: './tsdb-table.component.html',
})
export class TsdbTableComponent implements OnInit, OnDestroy {
  @ViewChild('NiFormComponent') NziFormComponent;

  data: Element[] = [];

  tsdbName = ''; // 用于筛选框
  popoverVisible = []; // 是否显示编辑按钮
  userId = this.userService.getUserId();
  environment: string;

  submitValue: any;
  hasError = false;
  error = null;

  /**
   * 分页使用的全局变量
   */
  _pageIndex = 0;
  _pageSize = 10;
  _total = 0;
  loading = false;

  constructor(private tsdbService: TsdbService, private modalService: NzModalService, private userService: UserService,
    private nzMessage: NzMessageService, private bssService: BssService, private cookiesService: CookiesService,
    private notification: NzNotificationService, private websocketService: WebsocketService, private router: Router) {}

  handleError(): any {
    throw new Error('Method not implemented.');
  }

  getEnvironment(environment: string) {
    this.environment = environment;
    this.getDomain(environment);
  }

  getDomain(environment: string) {
    this.tsdbService.getDomain(environment).subscribe(response => {
    });
  }

  getTsdbList() {
    this.loading = true;
    this.tsdbService.getTsdbList(this.tsdbName, 0, 99).subscribe(
      (response: any) => {
        this.loading = false;
        // this._total = response.result.total;
        if (response.result.total !== 0) {
          this.data = response.result.data;
          console.log('刷新TSDB列表！', response.message
          // , response
          );
        } else {
          console.log('TSDB列表为空！', response.message
          // , response
          );
        }
      });
  }

  // 刷新
  renovate(): void {
    this.tsdbName = '';
    this.tsdbService.getTsdbList('', this._pageIndex, this._pageSize).subscribe(
      (response: any) => {
        if (response.result.total !== 0) {
          this.data = response.result.data;
          console.log('刷新TSDB列表！', response.message
          // , response
          );
        } else {
          console.log('TSDB列表为空！', response.message
          // , response
          );
        }
      });
  }

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

  submit(i, value, data) {
    if (!this.hasError) {
      if (!this.submitValue || this.submitValue === value) {
        this.hasError = true;
        this.error = {
          noChange: true
        };
      } else {
        data.name = this.submitValue;
        const mid = this.nzMessage.loading('正在修改中', {
          nzDuration: 0
        }).messageId;
        this.tsdbService.editTsdbName(data.id, this.submitValue).subscribe(response => {
          console.log('修改TSDB名称！', response.message
          // , response
          );
          if (this.tsdbService.validateResponseCode(response.code)) {
            this.nzMessage.remove(mid);
            this.nzMessage.success(response.message);
          } else {
            this.nzMessage.remove(mid);
            this.nzMessage.error(response.message);
          }
        });
        this.popoverVisible[i] = false;
      }
    }
  }

  modelChange(value) {
    this.valid(value);
  }

  // 键盘监听回车
  onKey(event: any) {
    if (event.code === 'Enter') {
      this.getTsdbList();
    }
  }

  deleteTsdb(tsdbPto: any): void {
    if (tsdbPto.status === 'CREATE_FAILED') {
      this.tsdbService.deleteTsdb(tsdbPto.id).subscribe(response => {
        const message = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
        if (this.tsdbService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          this.getTsdbList();
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
          setTimeout(() => {this.getTsdbList(); console.log('延时刷新！'); }, 3000);
        } else {
          this.nzMessage.error('时序数据库退订失败！');
        }
      });
    }
  }

  showDeleteModal(data: any) {
    this.modalService.confirm({
      nzTitle: `确定删除时序数据库<em> " ` + data.name + ` " </em>吗？`,
      nzContent: '删除此数据库后，此数据库的用户以及数据信息无法恢复，请谨慎操作！',
      // 删除（释放）成功的时序数据库将会停止计费，未删除（释放）的时序数据库会继续计费。
      nzOnOk: () => this.deleteTsdb(data) ,
      nzOnCancel: () => console.log('取消')
    });
  }

  websocketServiceHandlerFunction(responseObj: WSResponseObj) {
    if (responseObj.handlerName === 'operateTsdbHandler') {
      // if (responseObj.operateType === 'TSDB' && responseObj.messageType === 'success') {
        this.data.forEach(data => {
          if (data.id === responseObj.instanceId) {
            data.status = responseObj.instanceStatus;
            if (data.status === 'DELETED') {
              this.getTsdbList();
            }
          }
        });
      // }
      if (!isNullOrUndefined(responseObj.message) && responseObj.message !== '') {
        this.notification.create(responseObj.messageType || 'blank', responseObj.message, '');
      }
    }
  }

  ngOnInit() {
    this.getTsdbList();
    this.websocketService.initHandler('operateTsdbHandler', this.websocketServiceHandlerFunction.bind(this));
    // console.log('当前租户 userId: ', this.userService.getUserId());
    // console.log('当前环境：', Environment.application.serviceAPI);
  }

  ngOnDestroy() {
    this.websocketService.destoryHandler();
  }

  navToPurchasePage() {
    // window.open('/#/tsdb?region=/' + NavHeaderService.region + '/add', '_blank');
    window.open('/tsdb/#/tsdb/add', '_blank');
  }

  navToDetail(data: any, tabIndex: number) {
    this.router.navigate(['/detail', {id: data.id, tabIndex: tabIndex}]);
  }
}

export class Element {
  [x: string]: string;
  id: string;
  name: string;

  spec: string;
  max_dp_num: string;
  wrt_dp_pers: string;
  storage_size: string;

  deploy_mode: string;
  replica_num: string;

  description: string;

}
