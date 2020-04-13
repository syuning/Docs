import { Injectable } from '@angular/core';
import { ErrorService } from 'ng-zorro-iop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Environment } from '../../../environments/environment';
import { TsdbConsoleCustomization } from '../tsdb/tsdb-table/tsdb-add/tsdb-add.component';
declare let require: any;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BssService {

// 敏捷环境：
// "bssFront: "http://10.221.2.4.xip.io:9080",
// "bssAPI": "http://10.221.2.6.xip.io:9080”

// 测试环境：
// "bssAPI": "http://bssapi.inspurtest.com:9080",
// "bssFront": "http://bss.inspurtest.com:9080"

// 生产环境：
// "bssAPI": "https://bssapi.cloud.inspur.com",
// "bssFront": "http://bss.cloud.inspur.com"

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  private handleError () {
    return (error: any): Observable<any> => {
      error = error.error || error;
      console.error('An error occurred', error);
      this.errorService.error(error);
      return observableThrowError(error);
    };
  }

  // 算费接口
  calculateCost(pto: any): Observable<any> {
    return this.http.post(Environment.application.bssAPI + '/order/product/price', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 获取用户配额接口
  getUserQuota(userId: string, region: string, productLineCode: string, productTypeCode: string, quotaType: string): Observable<any> {
    return this.http.get(Environment.application.bssAPI + '/crm/quota?userId=' + userId
    + '&region=' + region + '&productLineCode=' + productLineCode + '&productTypeCode=' + productTypeCode + '&quotaType=' + quotaType).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 订单确认页面接口
  confirmOrder(pto: any) {
    return this.http.post(Environment.application.bssAPI + '/order/confirm', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 订单接口
  placeOrder(pto: any) {
    return this.http.post(Environment.application.bssAPI + '/order/', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  unsubscribeProduct(pto: any) {
    return this.http.post(Environment.application.bssAPI + '/order/submitpay', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  userVerification(userId: string) {
    return this.http.get(Environment.application.serviceAPI + '/console/home/v1/usercertify?userId=' + userId).pipe(
  tap(response => response),
  catchError(this.handleError())
);
}

  /**
   * 获取产品详情,可多条件过滤产品详情
   */
  getProductDetail(userId: string, productLineCode: string, productTypeCode: string): Observable<any> {
    const url = Environment.application.bssAPI + '/product/detail?userId=' + userId + '&productLineCode='
    + productLineCode + '&productTypeCode=' + productTypeCode;
    return this.http.get(url, httpOptions).pipe(
        tap(response => response),
      catchError(this.handleError()));
  }

  // 处理 response code的方法
  // 1 验证code是否为200 - 成功返回结果
  validateResponseCode (responseCode: string): boolean {
    return responseCode.substring(7, 10) === (200 + '');
  }

  // 2 验证code是否为400 - 成功返回结果，结果为空
  validateResponseCodeEmpty (responseCode: string): boolean {
    return responseCode.substring(7, 10) === (400 + '');
  }

  downloadPto(pto: any) {
    const link = document.createElement('a');
    const blob = new Blob([JSON.stringify(pto)], { type: 'application/json' });
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', '报文' + '.json'); // 前端命名文件名
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generateTsdbOrderPto(userId: string, token: string, consoleOrderFlowId: string,
    billType: string, orderType: string, totalMoney: number, duration: number,
    durationUnit: string, isAutoRenew: boolean, tsdbConsoleCustomization: TsdbConsoleCustomization, region: string,
    instanceCount: number, dataPoint: number, diskVolume: number) {
      let TimeSeries_max = 0;
      switch (dataPoint) {
        case 3000:
        TimeSeries_max = 500000;
        break;
        case 10000:
        TimeSeries_max = 1000000;
        break;
        case 15000:
        TimeSeries_max = 2000000;
        break;
        case 30000:
        TimeSeries_max = 4000000;
        break;
        case 50000:
        TimeSeries_max = 8000000;
        break;
      }
    const orderPto = {
      userId: userId,
      token: token,
      orderRoute: 'TSDB',
      setCount: 1,
      consoleOrderFlowId: consoleOrderFlowId, // 订单流水号
      billType: billType, // hourlySettlement按需
      orderWhat: 'formal',
      orderType: orderType, // new创建，unsubscribe退订
      totalMoney: totalMoney,
      duration: duration, // 0
      durationUnit: durationUnit, // 'H'
      isAutoRenew: isAutoRenew,
      consoleCustomization: tsdbConsoleCustomization,
      productList: // * 产品列表
        [{
          region: region, // * 地域
          productLineCode: 'TSDB', // * 产品线编码 例：ECS 云服务器、EBS 云硬盘、EIP 弹性IP
          productTypeCode: 'TSDB_std', // * 产品类型 如IO优化型的云服务器
          productName: '通用型时序数据库',
          instanceCount: instanceCount, // * 单个商品的数量
          itemList: [ // *
            {
              code: 'dataPoint', // *
              name: '数据点',
              unit: 'dps/s',
              value: dataPoint, // (5000, 8000], 1000
              type: 'billingItem'
            },
            {
              code: 'diskVolume', // *
              name: '数据盘大小',
              unit: 'GiB',
              value: diskVolume, // (40, 5000], 40
              type: 'billingItem' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              code: 'DBInstanceType',
              name: '实例类型',
              unit: '',
              value: 'STD_Instance', // name: 通用型
              type: 'impactFactor' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            },
            {
              code: 'TimeSeries_max',
              name: '时间序列数',
              unit: '个',
              value: TimeSeries_max, // (10000, 300000], 1000
              type: 'other' // * 属性类型 - package套餐、billingItem计费项、impactFactor价格影响因子
            }
          ]
        }]
    };
    return orderPto;
  }

}

