import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username = ''; // 搜索框
  tsdbId = this.activedRoute.snapshot.params['id'];

  data: User[] = [];
  loading = false;

  /**
   * 分页使用的全局变量
   */
  _current = 1;
  _pageSize = 10;
  _total = 20;
  _sortValue = 'descend';

  constructor(private activedRoute: ActivatedRoute, private userService: UserService,
    private modalService: NzModalService, private nzMessage: NzMessageService) {}

  ngOnInit() {
    this.getUserList();
  }

  showDeleteConfirm(data: any) {
    this.modalService.confirm({
      nzTitle: '确认删除用户' + data.name + '吗？',
      nzContent: '<b style="color: red;">数据将无法恢复！</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteUser(data.name),
      nzCancelText: '否',
      nzOnCancel: () => console.log('取消')
    });
  }

  getUserList() {
    this.loading = true;
    // const current = this._current - 1;
    this.username = '';
    this.userService.getUserList(this.tsdbId, '', 0, 99).subscribe(
      (response: any) => {
        console.log('刷新用户列表！'
        // , response
        );
        this.loading = false;
        this.data = response.result.data;
        // this._total = response.result.total;
      });
  }

  searchUserList() {
    this.loading = true;
    const current = this._current - 1;
    this.userService.getUserList(this.tsdbId, this.username, current, this._pageSize).subscribe(
      (response: any) => {
        console.log('搜索用户列表！'
        // , response
        );
        this.loading = false;
        this.data = response.result.data;
        this._total = response.result.total;
      });
  }

  // 键盘监听回车
  onKey(event: any) {
    if (event.code === 'Enter') {
      this.getUserList();
    }
  }

  deleteUser(username: string) {
    this.loading = true;
    this.userService.deleteUser(this.tsdbId, username).subscribe(response => {
      const message = this.nzMessage.loading('正在删除中', {
        nzDuration: 0
      }).messageId;
      console.log('删除用户！'
      // , response
      );
      if (this.userService.validateResponseCode(response.code)) {
        this.nzMessage.remove(message);
        this.nzMessage.success(response.message);
        this.loading = false;
        this.getUserList();
      } else {
        this.nzMessage.remove(message);
        this.nzMessage.error(response.message);
        this.loading = false;
      }
    });
  }

  roleTrans(role: string): string {
    switch (role) {
      case 'WO':
        return '数据源用户';

      case 'RW':
        return '应用用户';

      case 'ADMIN':
        return '管理用户';
    }
  }

  navToDocumentPage() {
    window.open('/document/tsdb/index.html', '_blank');
  }

}
export class User {
  tsdb_id: string;
  username: string;
  role: string;
  password: string;
  description: string;
  create_time: string;
}
