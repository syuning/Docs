import { Injectable } from '@angular/core';
import { ErrorService } from 'ng-zorro-iop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Config } from 'protractor/built/config';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ClnJobService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getDomain(environment: string): Observable < any > {
    return this.http.get<Config>('/cks/servicemesh/v1/clusters/' + environment + '/sub-domains', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* clear-controller - 数据清理任务接口 */
  // Get ClnJob list by clnJobName
  getClnJobList(tsdbId: string, page: number, pgsize: number, type: string): Observable < any > {
    // http://localhost:8080/tsdb/v1/tsdbs/8a8186d467b0ddcc0167c013f5630011/tasks/M_CLN/0/10
    return this.http.get<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/tasks/' + page + '/' + pgsize + '?type=' + type
    , { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }
  // 清理数据 - POST - /tsdb/v1/tsdbs/{id}/data/delete
  cleanData(tsdbId: string, pto: any): Observable < any > {
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/action/clean', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 数据时效 GET - /tsdb/v1/tsdbs/{tsdbId}/action/auto-clean     POST/PUT - /tsdb/v1/tsdbs/{tsdbId}/action/auto-clean?retain=
  getAutoCleanJob(tsdbId: string) {
    return this.http.get<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/action/auto-clean', { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }
  addAutoCln(tsdbId: string, retain: string): Observable < any > {
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/action/auto-clean?retain=' + retain, httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }
  editAutoCln(tsdbId: string, retain: string): Observable < any > {
    return this.http.put('/tsdb/v1/tsdbs/' + tsdbId + '/action/auto-clean?retain=' + retain, httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  deleteAutoClnJob(tsdbId: string): Observable < any > {
    return this.http.delete('/tsdb/v1/tsdbs/' + tsdbId + '/action/auto-clean').pipe(
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

  private handleError() {
    return (error: any): Observable < any > => {
      error = error.error || error;
      console.error('An error occurred', error);
      this.errorService.error(error);
      return observableThrowError(error);
    };
  }

}
