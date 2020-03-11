import { Injectable } from '@angular/core';
import { ErrorService } from 'ng-zorro-iop';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Environment } from '../../../environments/environment';
import { compileComponentFromMetadata } from '@angular/compiler';
import { stringify } from 'querystring';
import { Config } from 'protractor/built/config';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json'
     })
};

@Injectable()
export class TsdbService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getDomain(environment: string): Observable<any> {
    return this.http.get<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/cks/servicemesh/v1/clusters/' + environment + '/sub-domains', { observe: 'response' }).pipe(
      tap( response => response ),
      catchError(this.handleError())
    );
  }

  /* tsdb controller - 1时序数据库列表 & 2时序数据库详情 & 3创建时序数据库 & 4删除时序数据库  & 5修改数据库名称*/
  // 1 时序数据库列表 - GET /tsdb/v1/tsdbs/{page}/{page_size}
  getTsdbList(name: String, pageIndex: number, pageSize: number): Observable<any>  {
    let url = Environment.application.serviceAPI +
    '/regionsvc-' + Environment.application.defaultRegion +
    '/tsdb/v1/tsdbs/' + pageIndex + '/' + pageSize + '?';
    if (name !== '' && name !== null) {
      url += '&tsdbName=' + name;
    }
    // return this.http.get(url).pipe(
    //   tap(response => response),
    //   catchError(this.handleError())
    // );
    return this.http.get<Config>( url, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError()));
  }

  // 2 时序数据库详情 - GET /tsdb/v1/tsdbs/{id}
  getIndividualTsdb(id: string): Observable<any> {
    return this.http.get<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/tsdb/v1/tsdbs/' + id, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 3 创建数据库 - POST /tsdb/v1/tsdbs
  createTsdb(data: any): Observable<any> {
    return this.http.post<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/tsdb/v1/tsdbs', JSON.stringify(data), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 4 删除时序数据库 - DELETE /tsdb/v1/tsdbs/{id}
  deleteTsdb(id: string): Observable<any> {
    return this.http.delete<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/tsdb/v1/tsdbs/' + id, httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 5 修改时序数据库名称 - PUT /tsdb/v1/tsdbs/{id}
  editTsdbName(tsdbId: string, name: string): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002?name=ssss
    return this.http.put<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/tsdb/v1/tsdbs/' + tsdbId + '?tsdbName=' + name, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* task controller */
  // 1 获取任务列表 - GET - /tsdbs/v1/tsdb/{tsdb_id}/tasks/{role}/{page}/{page_size}
  getTaskList(tsdbId: string, pageIndex: number, pageSize: number, type: string): Observable<any> {
    const url = Environment.application.serviceAPI +
    '/regionsvc-' + Environment.application.defaultRegion +
    '/tsdb/v1/tsdbs/' + tsdbId + '/tasks/' + pageIndex + '/' + pageSize + '?type=' + type;
    return this.http.get<Config>(url, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 2 获取任务详情 - GET - /tsdbs/v1/tsdb/{tsdb_id}/tasks/{id}
  getIndividualTask(tsdbId: string, id: string): Observable<any> {
    return this.http.get<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/tsdb/v1/tsdbs/' + tsdbId + '/tasks/' + id, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* monitor controller */
  // 1 监控 - POST - /tsdb/v1/tsdbs/{id}/monitor
  monitors(tsdbId: string, pto: any): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/querys/monitor
    return this.http.post<Config>(
      Environment.application.serviceAPI +
      '/regionsvc-' + Environment.application.defaultRegion +
      '/tsdb/v1/tsdbs/' + tsdbId + '/monitor', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* outline controller */
  // 1 概览
  getOutlineInfo(region: string): Observable<any> {
    return this.http.get<Config>(
      Environment.application.serviceAPI + '/regionsvc-' + region + '/tsdb/v1/statistics', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 测试用 - 下载报文
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
      console.error('出错惹！！！！', error);
      this.errorService.error(error);
      return observableThrowError(error);
    };
  }
}
