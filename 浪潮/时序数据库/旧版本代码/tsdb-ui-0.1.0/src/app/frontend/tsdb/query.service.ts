import { Injectable } from '@angular/core';
import { ErrorService } from 'ng-zorro-iop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Config } from 'protractor/built/config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getDomain(environment: string): Observable<any> {
    return this.http.get<Config>('/cks/servicemesh/v1/clusters/' + environment + '/sub-domains', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* query controller - 查询面板 - Echart生成接口 */
  // 查询面板 - POST - /tsdb/v1/tsdbs/{id}/querys
  query(tsdbId: string, pto: any): Observable<any> {
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/query', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }
  /* mould controller - 查询面板 - 模板列表 & 模板增删改查 */
  getTemplateList(tsdbId: string): Observable<any> {
    return this.http.get<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/templates/0/99', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // /tsdb/v1/tsdbs/{tsdbId}/templates/metric GET
  getMetricList(tsdbId: string): Observable<any> {
    return this.http.get<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/templates/metric', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // /tsdb/v1/tsdbs/{tsdbId}/templates/metric/{metricValue} GET
  getTagK(tsdbId: string, metricValue: string): Observable<any> {
    return this.http.get<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/templates/metric/' + metricValue + '/tagK', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  getTagV(tsdbId: string, metricValue: string, tagK: string) {
    const pto = {};
        return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/templates/metric/' + metricValue + '/tagK/' + tagK, pto, httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  deleteTemplate(tsdbId: string, templateId: string): Observable<any> {
    return this.http.delete('/tsdb/v1/tsdbs/' + tsdbId + '/templates/' + templateId).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
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
