import { Injectable } from '@angular/core';
import { ErrorService } from 'ng-zorro-iop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getDomain(environment: string): Observable<any> {
    return this.http.get('/cks/servicemesh/v1/clusters/' + environment + '/sub-domains').pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* query controller - 查询面板 - Echart生成接口 */
  // 查询面板 - POST - /tsdb/v1/tsdbs/{id}/querys
  query(tsdbId: string, pto: any): Observable<any> {
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/querys', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  /* mould controller - 查询面板 - 模板列表 & 模板增删改查 */
  // GET /tsdb/v1/tsdbs/{id}/{page}/{page_size} - Page query Tsdb Instance mould list
  getTemplateList(templateName: string, tsdbId: string, page: number, pgsize: number): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a815ef040000/moulds/0/10?name=aaa
    let url = '/tsdb/v1/tsdbs/' + tsdbId + '/moulds/' + page + '/' + pgsize;
    if (templateName !== '' && templateName !== null) {
      url += '?name=' + templateName;
    }
    return this.http.get(url).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // POST /tsdb/v1/tsdbs/{id}/mould add query mould
  createTemplate(tsdbID: string, data: any): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a8186d467b0ddcc0167b10ebc1b0000/mould
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbID + '/moulds', JSON.stringify(data), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  editTemplate(tsdbId: string, templateId: string, pto: any) {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/moulds/8a81841f68a812840168abd9b3130008/update
    return this.http.put('/tsdb/v1/tsdbs/' + tsdbId + '/moulds/' + templateId + '/update', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  deleteTemlate(tsdbId: string, templateId: string): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/moulds/8ac8c78368abca260168abd7009c0000/delete
    return this.http.delete('/tsdb/v1/tsdbs/' + tsdbId + '/moulds/' + templateId + '/delete').pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 处理 response code的方法
  // 1 验证code是否为200 - 成功返回结果
  validateResponseCode (responseCode: string): boolean {
    return responseCode.substring(7, 10) === (200 + '');
  }
  
  // 2 验证code是否为400 - 成功返回结果，结果为空
  // validateResponseCodeEmpty (responseCode: string): boolean {
  //   return responseCode.substring(7, 10) === (400 + '');
  // }

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
