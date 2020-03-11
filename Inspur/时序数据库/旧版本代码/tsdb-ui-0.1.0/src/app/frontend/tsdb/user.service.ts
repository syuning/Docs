import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError, throwError} from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { Config } from 'protractor/built/config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Observe': 'response'
  })
};

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private nzMessageService: NzMessageService) {}

  /* user controller - 1用户列表 & 2用户详情 & 3新增用户 & 4删除用户 & 5重置用户密码 */

  // 1 用户列表 GET - /tsdb/v1/tsdbs/{tsdb_id}/users/{page}/{page_size}
  getUserList(tsdbId: string, name: string, pageIndex: number, pageSize: number): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a8168b767de1b6e0167e354b68f0118/users/0/10?userName=guu333
    let url = '/tsdb/v1/tsdbs/' + tsdbId + '/users/' + pageIndex + '/' + pageSize;
    if (name !== '') {
      url += '?userName=' + name;
    }
    return this.http.get<Config>(url, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError),
      retry(3)
      );
  }

  // 2 用户详情 GET - /tsdb/v1/tsdbs/{tsdb_id}/users/{id}
  getData(tsdbId: string, id: string): Observable<any> {
    return this.http.get<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/users/' + id, { observe: 'response' }).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // 3 新增用户 POST - /tsdb/v1/tsdbs/{tsdb_id}/users
  createUser(tsdbId: string, data: any): Observable<any> {
    return this.http.post<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/users', JSON.stringify(data),
    httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // 4 编辑用户 PUT /tsdb/v1/tsdbs/{tsdb_id}/users/{userName}
  editUserInfo(tsdbId: string, pto: any, paramType: string): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/users
    return this.http.patch<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/users' + '?paramType=' + paramType
    , JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // 5 删除用户 DELETE - /tsdb/v1/tsdbs/{tsdb_id}/users/{id}
  deleteUser(tsdbId: string, userId: string): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81cbb7681876780168302308660001/users/guu333
    return this.http.delete<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/users/' + userId).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // 6 重置用户密码 PUT /dbs/tsdb/{tsdb_id}/user/{id}/resetpwd
  resetPassword(tsdbId: string, pto: any, paramType): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/users
    return this.http.patch<Config>('/tsdb/v1/tsdbs/' + tsdbId + '/users' + '?paramType=' + paramType,
     JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError)
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('发生了一个错误：', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `后端返回错误码 ${error.status}, ` + `响应体错误详情: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      '发生了一个错误，请稍后重试');
  }

  // private handleError () {
  //   return (error: any): Observable<any> => {
  //     error = error.error || error;
  //     console.error('An error occurred', error);
  //     this.nzMessageService.remove();
  //     this.nzMessageService.error(error.message || error.err_message, {nzDuration: 3000});
  //     return observableThrowError(error);
  //   };
  // }

}

