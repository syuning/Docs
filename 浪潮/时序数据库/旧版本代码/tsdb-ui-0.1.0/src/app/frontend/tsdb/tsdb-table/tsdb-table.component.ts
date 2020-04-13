import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { NziModalService} from 'ng-zorro-iop/modal/nzi-modal.service';
import { TsdbService} from '../tsdb.service';
import { BssService } from '../bss.service';
import { UserService, WebsocketService, WSResponseObj } from '@global/shared';
import { CookiesService } from 'ng-zorro-iop';
import { isNullOrUndefined } from 'util';
import { Router} from '@angular/router';
declare let require: any;
import { Environment } from '../../../../environments/environment';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';

@Component({
  selector: 'app-tsdb-table',
  styleUrls: ['./tsdb-table.component.css'],
  templateUrl: './tsdb-table.component.html',
})
export class TsdbTableComponent implements OnInit, OnDestroy {
  @ViewChild('NiFormComponent') NziFormComponent;

  tsdbList: TsdbInstance[] = [];

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

  constructor(private tsdbService: TsdbService, private modalService: NziModalService, private userService: UserService,
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
        if (response.status === 200) {
          this.tsdbList = response.body.result.data;
        } else {
          const tsdb1: TsdbInstance[] = [
            {
              id: 'testTsdbId01',
              name: '请求列表是空的我是假的只是测试用',
              bill_mode: 'hourlySettlement',
              cluster_url: 'http://10.110.25.114:31823',
              create_time: 1558009097440,
              creator_id: 'd603f7fb-c745-4a94-b8fb-09ef483130fc',
              deleted: false,
              deploy_mode: 'SINGLE',
              domain: 'tsdb.tsdb-strwqyex.10.110.25.114.xip.io',
              environment: null,
              last_update_time: 1558009148786,
              max_dp_num: 500000,
              namespace: 'tsdb',
              owner_id: 'd603f7fb-c745-4a94-b8fb-09ef483130fc',
              port: 80,
              region: 'cn-north-3',
              replica_num: 1,
              service_url: 'http://10.110.25.114:31823',
              spec: null,
              status: 'RUNNING',
              storage_class: null,
              storage_size: 40,
              suit_code: 'std_3000',
              web_url: 'https://tsdb.tsdb-strwqyex.10.110.25.114.xip.io',
              wrt_dp_pers: 3000
            }
        ];
          this.tsdbList = [];
        }

        // 控制台信息
        console.log('刷新TSDB列表！' + response.statusText + response.status);
      }
      );
  }

  // 刷新
  renovate(): void {
    this.loading = true;
    this.tsdbName = '';
    this.tsdbService.getTsdbList('', this._pageIndex, this._pageSize).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.result.total !== 0) {
          this.tsdbList = response.result.data;
        } else {
          const tsdb = {
            id: 'testTsdbId01',
            name: '请求列表是空的我是假的只是测试用',
            bill_mode: 'hourlySettlement',
            cluster_url: 'http://10.110.25.114:31823',
            create_time: 1558009097440,
            creator_id: 'd603f7fb-c745-4a94-b8fb-09ef483130fc',
            deleted: false,
            deploy_mode: 'SINGLE',
            domain: 'tsdb.tsdb-strwqyex.10.110.25.114.xip.io',
            environment: null,
            last_update_time: 1558009148786,
            max_dp_num: 500000,
            namespace: 'tsdb',
            owner_id: 'd603f7fb-c745-4a94-b8fb-09ef483130fc',
            port: 80,
            region: 'cn-north-3',
            replica_num: 1,
            service_url: 'http://10.110.25.114:31823',
            spec: null,
            status: 'RUNNING',
            storage_class: null,
            storage_size: 40,
            suit_code: 'std_3000',
            web_url: 'https://tsdb.tsdb-strwqyex.10.110.25.114.xip.io',
            wrt_dp_pers: 3000
          };
          const tsdb1: TsdbInstance[] = [];
          this.tsdbList = tsdb1;
        }
        // 控制台信息
        console.log('刷新TSDB列表！' + response.statusText + response.status);
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
        this.popoverVisible[i] = false;
      } else {
        data.name = this.submitValue;
        if (data.status === 'RUNNING') {
          const mid = this.nzMessage.loading('正在修改中', { nzDuration: 0 }).messageId;
          this.tsdbService.editTsdbName(data.id, this.submitValue).subscribe(response => {
              this.nzMessage.remove(mid);
              this.nzMessage.success('更新时序数据库名称成功！');

        // 控制台信息
        console.log('修改TSDB名称！' + response.statusText + response.status);
          });
        } else {
          this.nzMessage.error('时序数据库状态不可用，无法更新时序数据库名称！');
        }
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
      const message = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
      this.tsdbService.deleteTsdb(tsdbPto.id).subscribe(response => {
        // if (response.result !== undefined) {
          this.nzMessage.remove(message);
        //   this.nzMessage.success(response.message);
        // } else {
        //   this.nzMessage.remove(message);
        //   this.nzMessage.error(response.message);
        // }
        this.getTsdbList();
      });
    } else {
      const uuid = require('uuid/v4');
      const pto = {
        userId: this.userId,
        token: this.cookiesService.getCookie('inspur_token'),
        orderRoute: 'TSDB',
        setCount: '1',
        consoleOrderFlowId: uuid(), // *订单流水号
        billType: tsdbPto.billMode,
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
        if (response.code === '0') {
          this.nzMessage.remove(mid);
          this.nzMessage.success('时序数据库退订成功！');
          setTimeout(() => {this.getTsdbList(); console.log('延时刷新！'); }, 3000);
        } else {
          this.nzMessage.error('时序数据库退订失败！');
        }
        // 控制台信息
        console.log('提交退订订单！' + response.statusText + response.status);
      });
    }
  }

  showDeleteModal(data: any) {
    console.log(data);
    this.modalService.delete({
      nzTitle: '删除时序数据库',
      nzContentTitle: `确定删除时序数据库<em> " ` + data.name + ` " </em>吗？`,
      nzContent: '删除数据不可恢复与访问，请谨慎操作！',
      // 删除（释放）成功的时序数据库将会停止计费，未删除（释放）的时序数据库会继续计费。
      nzOnOk: () => this.deleteTsdb(data) ,
      nzOnCancel: () => console.log('取消')
    });
  }

  websocketServiceHandlerFunction(responseObj: WSResponseObj) {
    if (responseObj.handlerName === 'operateTsdbHandler') {
      // if (responseObj.operateType === 'TSDB' && responseObj.messageType === 'success') {
        this.tsdbList.forEach(data => {
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

  renewTsdb(data: any) {
    const uuid = require('uuid/v4');
    const tsdbConsoleCustomization = {
      instanceName: data.name,
      instancePassword: null,
      duration: 1,
      durationUnit: 'M',
      planCode: data.suitCode
    };
    const pto = this.bssService.generateTsdbOrderPto(this.userId, this.cookiesService.getCookie('inspur_token'),
    uuid(), data.billMode, 'renew', 0, 1, 'M', false, tsdbConsoleCustomization, data.region, 1,
     data.suitCode.substring(4, 8), data.storageSize, data.id);
    this.bssService.calculateCost(pto).subscribe(response => {
      pto.totalMoney = response.result.totalMoney;
      this.bssService.confirmOrder(pto).subscribe(response2 => {
        this.loading = false;
        if (response2.result !== null && response2.result.key !== null) {
          this.loading = true;
          window.location.href = Environment.application.bssFront + '/order/confirm/' + response2.result.key;
        }
        console.log(
          '提交订单！'
          // response.message
          , response2.code
        // , pto
        // , response
        );
      });
    });
    // this.bssService.downloadPto(pto);
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

export class TsdbInstance {
  id: string;
  name: string;
  bill_mode: string;
  cluster_url: string;
  create_time: number;
  creator_id: string;
  deleted: false;
  deploy_mode: string;
  domain: string;
  environment: string;
  last_update_time: number;
  max_dp_num: number;
  namespace: string;
  owner_id: string;
  port: number;
  region: string;
  replica_num: number;
  service_url: string;
  spec: number;
  status: string;
  storage_class: number;
  storage_size: number;
  suit_code: string;
  web_url: string;
  wrt_dp_pers: number;
}
