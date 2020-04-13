import { Injectable } from '@angular/core';
import { ErrorService } from 'ng-zorro-iop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Environment } from '../../../environments/environment';

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

  private handleError () {
    return (error: any): Observable<any> => {
      error = error.error || error;
      console.error('An error occurred', error);
      this.errorService.error(error);
      return observableThrowError(error);
    };
  }
}
