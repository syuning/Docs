import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  throwError as observableThrowError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
    return this.http.get(url).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 2 用户详情 GET - /tsdb/v1/tsdbs/{tsdb_id}/users/{id}
  getData(tsdbId: string, id: string): Observable<any> {
    return this.http.get('/tsdb/v1/tsdbs/' + tsdbId + '/users/' + id).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 3 新增用户 POST - /tsdb/v1/tsdbs/{tsdb_id}/users
  createUser(tsdbId: string, data: any): Observable<any> {
    return this.http.post('/tsdb/v1/tsdbs/' + tsdbId + '/users', JSON.stringify(data), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 4 编辑用户 PUT /tsdb/v1/tsdbs/{tsdb_id}/users/{userName}
  editUserInfo(tsdbId: string, pto: any): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/users
    return this.http.put('/tsdb/v1/tsdbs/' + tsdbId + '/users/', JSON.stringify(pto), httpOptions).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 5 删除用户 DELETE - /tsdb/v1/tsdbs/{tsdb_id}/users/{id}
  deleteUser(tsdbId: string, username: string): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81cbb7681876780168302308660001/users/guu333
    return this.http.delete('/tsdb/v1/tsdbs/' + tsdbId + '/users/' + username).pipe(
      tap(response => response),
      catchError(this.handleError())
    );
  }

  // 6 重置用户密码 PUT /dbs/tsdb/{tsdb_id}/user/{id}/resetpwd
  resetPassword(tsdbId: string, pto: any): Observable<any> {
    // http://localhost:8080/tsdb/v1/tsdbs/8a81841f68a812840168a82151a30002/users
    return this.http.patch('/tsdb/v1/tsdbs/' + tsdbId + '/users', JSON.stringify(pto), httpOptions).pipe(
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
      this.nzMessageService.remove();
      this.nzMessageService.error(error.message || error.err_message, {nzDuration: 3000});
      return observableThrowError(error);
    };
  }
}
