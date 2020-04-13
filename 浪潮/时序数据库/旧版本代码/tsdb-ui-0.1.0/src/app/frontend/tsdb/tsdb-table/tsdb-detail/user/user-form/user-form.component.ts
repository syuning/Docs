import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { UserService } from '../../../../user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { userTypes } from '../../../../consts';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() tsdbId: string;
  @Input() userName: string;
  @Input() userRole: string;
  @Input() isCreate: boolean;
  @Input() isEdit: boolean;
  @Input() isReset: boolean;
  userTypes = userTypes;

  userForm: FormGroup;
  status: any = {
    username: false,
    role: false,
    password: false,
    confirmPassword: false
  };

  constructor(private userService: UserService, private fb: FormBuilder,
    private nzMessage: NzMessageService) {}

  submitUserForm(): void {
    for (const i in this.userForm.controls) {
      if (this.userForm.controls.hasOwnProperty(i)) {
        this.userForm.controls[i].markAsDirty();
        this.userForm.controls[i].updateValueAndValidity();
      }
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.userForm.controls.checkPassword.updateValueAndValidity());
  }

  passwordLengthValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return null;
    } else if (control.value.length < 8 || control.value.length > 32) {
      return { length: true };
    }
  }

  passwordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return null;
    } else if (!((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{0,100}$/).test(control.value))) {
      return { invalid: true };
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return null;
    } else if (control.value !== this.userForm.controls.password.value) {
      return {
        invalid: true
      };
    }
  }

  usernameValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return null;
    } else if (!((/^[a-z][a-z0-9-]*$/).test(control.value))) {
      return { invalid: true };
    }
  }

  usernameLengthValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return null;
    } else if (control.value.length < 5 || control.value.length > 32) {
      return { length: true };
    }
  }

  resetUserForm() {
    this.userForm.reset();
    this.userForm.setValue({
      username: null,
      role: 'RW',
      password: null,
      checkPassword: null
    });
  }

  getFormControl(name) {
    return this.userForm.controls[name];
  }

  getFormValue(name) {
    return this.userForm.controls[name].value;
  }

  getFormControlStatus(name, attribute): string {
    const formName = this.userForm.controls[name].hasError(attribute);
    let message: string;
    if ((this.userForm.controls[name].value === null) || (this.userForm.controls[name].value.length === 0)) {
      message = 'default';
    } else if (formName === true) {
      message = 'wrong';
    } else if (formName === false) {
      message = 'right';
    }
    return message;
  }

  createUser(): boolean {
    const message = this.nzMessage.loading('正在创建中', { nzDuration: 0 }).messageId;
      const data = {
        name: this.userForm.value.username,
        password: this.userForm.value.password,
        role: this.userForm.value.role
      };
      this.userService.createUser(this.tsdbId, data).subscribe(response => {
        console.log(response);
        this.nzMessage.remove(message);
        if (String(response.code) === '200') {
          this.nzMessage.success('创建用户成功！', { nzDuration: 1000 });
        } else if (String(response.code.substring(7, 10)) === '400') {
          this.nzMessage.error(response.message, { nzDuration: 1000 });
        } else {
          this.nzMessage.error('创建用户失败！', { nzDuration: 1000 });
        }

        // 控制台信息
        console.log('创建用户！' + response.statusText + response.status);

      });
      this.resetUserForm();
      return false;
  }

  editUser() {
    const pto = {
      name: this.userName,
      role: this.userForm.value.role
    };
    const message = this.nzMessage.loading('正在编辑中', { nzDuration: 0 }).messageId;
    this.userService.editUserInfo(this.tsdbId, pto, 'role').subscribe(response => {
      this.nzMessage.remove(message);
      if (String(response.code) === '200') {
        this.nzMessage.success('编辑用户信息成功！', { nzDuration: 1000 });
      } else if (String(response.code.substring(7, 10)) === '400') {
        this.nzMessage.error(response.message, { nzDuration: 1000 });
      } else {
        this.nzMessage.error('编辑用户信息失败！', { nzDuration: 1000 });
      }

      // 控制台信息
      console.log('编辑用户！' + response.statusText + response.status);
    });
  }

  resetUserPassword() {
    const pto = {
      role: 'admin',
      name: this.userName,
      password: this.userForm.value.password
    };
    const message = this.nzMessage.loading('正在重置中', { nzDuration: 0 }).messageId;
    this.userService.resetPassword(this.tsdbId, pto, 'password').subscribe(response => {
      this.nzMessage.remove(message);

      if (String(response.code) === '200') {
        this.nzMessage.success('重置用户密码成功！', { nzDuration: 1000 });
      } else if (String(response.code.substring(7, 10)) === '400') {
        this.nzMessage.error(response.message, { nzDuration: 1000 });
      } else {
        this.nzMessage.error('重置用户密码失败！', { nzDuration: 1000 });
      }

      // 控制台信息
      console.log('重置用户密码！' + response.statusText + response.status);
    });
  }

  ngOnInit() {
    if (this.isCreate) {
      this.userForm = this.fb.group({
        username: [null, [Validators.required, this.usernameValidator, this.usernameLengthValidator]],
        role: ['RW', [Validators.required]],
        password: [null, [Validators.required, this.passwordValidator, this.passwordLengthValidator]],
        checkPassword: [null, [Validators.required, this.confirmationValidator]],
      });
    } else if (this.isEdit) {
      this.userForm = this.fb.group({
        username: [this.userName, [Validators.required, this.usernameValidator, this.usernameLengthValidator]],
        role: [this.userRole, [Validators.required]],
        password: [null],
        checkPassword: [null],
      });
      this.userForm.get('username').disable();
    } else if (this.isReset) {
      this.userForm = this.fb.group({
        username: [this.userName, [Validators.required, this.usernameValidator, this.usernameLengthValidator]],
        role: [null],
        password: [null, [Validators.required, this.passwordValidator, this.passwordLengthValidator]],
        checkPassword: [null, [Validators.required, this.confirmationValidator]],
      });
      this.userForm.get('username').disable();
    }
  }

}
