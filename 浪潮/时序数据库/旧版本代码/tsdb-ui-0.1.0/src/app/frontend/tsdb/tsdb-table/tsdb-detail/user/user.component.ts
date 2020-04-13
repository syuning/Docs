import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { NziModalService} from 'ng-zorro-iop/modal/nzi-modal.service';
import { UserService } from '../../../user.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username = ''; // 搜索框
  tsdbId = this.activedRoute.snapshot.params['id'];

  userList: User[] = [];
  loading = false;

  /**
   * 分页使用的全局变量
   */
  _current = 1;
  _pageSize = 10;
  _total = 20;
  _sortValue = 'descend';

  constructor(private activedRoute: ActivatedRoute, private userService: UserService,
    private modalService: NziModalService, private nzMessage: NzMessageService) {}

  ngOnInit() {
    this.getUserList();
  }

  showDeleteConfirm(data: any) {
    this.modalService.delete({
      nzTitle: '删除用户',
      nzContentTitle: '确认删除用户<em>“' + data.name + '</em>”吗？',
      nzContent: '删除数据不可恢复与访问，请谨慎操作！',
      // nzOkText: '是',
      // nzOkType: 'danger',
      nzOnOk: () => this.deleteUser(data.id),
      // nzCancelText: '否',
      nzOnCancel: () => console.log('取消')
    });
  }

  addUserModal() {
    this.modalService.create({
      nzTitle: '新建用户',
      nzContent: UserFormComponent,
      nzComponentParams: {
        tsdbId: this.tsdbId,
        isCreate: true,
        isEdit: false,
        isReset: false
      },
      nzWidth: 500,
      nzMaskClosable: false,
      nzOnOk: (componentInstance) => {
        componentInstance.submitUserForm();
        if (componentInstance.userForm.valid) {
          componentInstance.createUser();
          setTimeout(() => this.getUserList(), 3000);
          return true;
        }
        return false;
      }
    });
  }

  editUserModal(data: any) {
    this.modalService.create({
      nzTitle: '编辑用户',
      nzContent: UserFormComponent,
      nzComponentParams: {
        tsdbId: this.tsdbId,
        userName: data.name,
        userRole: data.role,
        isCreate: false,
        isEdit: true,
        isReset: false,
      },
      nzWidth: 500,
      nzOnOk: (componentInstance) => {
        componentInstance.submitUserForm();
        if (componentInstance.userForm.valid) {
          componentInstance.editUser();
          setTimeout(() => this.getUserList(), 3000);
          return;
        }
        return false;
      }
    });
  }

  resetUserPasswordModal(data: any) {
    this.modalService.create({
      nzTitle: '重置用户密码',
      nzContent: UserFormComponent,
      nzComponentParams: {
        tsdbId: this.tsdbId,
        userName: data.name,
        isCreate: false,
        isEdit: false,
        isReset: true
      },
      nzWidth: 500,
      nzOnOk: (componentInstance) => {
        componentInstance.submitUserForm();
        if (componentInstance.userForm.valid) {
          componentInstance.resetUserPassword();
          setTimeout(() => this.getUserList(), 3000);
          return;
        }
        return false;
      }
    });
  }

  getUserList() {
    this.loading = true;
    // const current = this._current - 1;
    this.username = '';
    this.userService.getUserList(this.tsdbId, '', 0, 99).subscribe( (response: any) => {
      if (response.status === 200) {
        this.loading = false;
        this.userList = response.body.result.data;
      } else {
        this.loading = false;
      }

      // 控制台信息
      console.log('刷新用户列表！' + response.statusText + response.status);
      });
  }

  searchUserList() {
    this.loading = true;
    const current = this._current - 1;
    this.userService.getUserList(this.tsdbId, this.username, current, this._pageSize).subscribe(
      (response: any) => {
        this.loading = false;
        this.userList = response.result.data;
        this._total = response.result.total;

        // 控制台信息
        console.log('搜索用户列表！' + response.statusText + response.status);
      });
  }

  // 键盘监听回车
  onKey(event: any) {
    if (event.code === 'Enter') {
      this.getUserList();
    }
  }

  deleteUser(userId: string) {
    const message = this.nzMessage.loading('正在删除中', { nzDuration: 0 }).messageId;
    this.loading = true;
    this.userService.deleteUser(this.tsdbId, userId).subscribe(response => {
        this.nzMessage.remove(message);
        this.nzMessage.success('删除用户成功！', { nzDuration: 1000 });
        this.getUserList();
      // }

      // 控制台信息
      console.log('删除用户！' + response.statusText + response.status);

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
  name: string;
  role: string;
  password: string;
  create_time: number;
  last_update_time: number;
}
