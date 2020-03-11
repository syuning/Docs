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
export class ImExportService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getDomain(environment: string): Observable<any> {
    return this.http.get<Config>('/cks/servicemesh/v1/clusters/' + environment + '/sub-domains', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* data controller - 数据导入、导出 */
  // 提交导入示范数据 - POST - /tsdb/v1/tsdbs/{id}/data
  importSampleData(tsdbId: string): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/data/impSample?step=400
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/action/import-sample-data?step=400', httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

    // 导出数据 - POST /tsdb/v1/tsdbs/{tsdb_id}/data/export
    exportData(tsdbId: string, pto: any): Observable<any> {
      // /tsdb/v1/tsdbs/8a8168b767de1b6e0167e354b68f0118/data/export
      return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/data/export', JSON.stringify(pto), httpOptions).pipe(
        tap(response => response),
        catchError(this.handleError())
      );
    }

    // 下载示例数据为csv文件 - GET /tsdb/v1/tsdbs/{tsdb_id}/data/dlSample
  getSampleData(): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/dlSample
    return this.http.get<Config>('/tsdb/v1/tsdbs/action/download-sample-data',  {
      //  responseType: 'blob',
       observe: 'response'
      } ).pipe(
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
