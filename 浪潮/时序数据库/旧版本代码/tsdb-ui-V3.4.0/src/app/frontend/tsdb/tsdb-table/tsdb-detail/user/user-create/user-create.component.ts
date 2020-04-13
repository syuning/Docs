import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { UserService } from '../../../../user.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MessageService } from '@trident/shared';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { userTypes } from '../../../../consts';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  // styleUrls: ['./user-create.component.css']
})
export class UserModalComponent implements OnInit {
  @Output() myEvent = new EventEmitter();
  userTypes = userTypes;

  createUserForm: FormGroup;
  isCreateModalVisible = false;
  tsdbId = this.activedRoute.snapshot.params['id'];
  isButtonLoading = false;

  constructor(private userService: UserService, private fb: FormBuilder,
    private activedRoute: ActivatedRoute, private message: MessageService,
    private nzMessage: NzMessageService) {}

  showCreateModal(): void {
    this.isCreateModalVisible = true;
  }

  submitCreateUserForm(): void {
    for (const i in this.createUserForm.controls) {
      if (this.createUserForm.controls.hasOwnProperty(i)) {
        this.createUserForm.controls[i].markAsDirty();
        this.createUserForm.controls[i].updateValueAndValidity();
      }
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.createUserForm.controls.checkPassword.updateValueAndValidity());
  }

  passwordValidator = (control: FormControl): {
    [s: string]: boolean
  } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/).test(control.value)) {
      return {
        invalid: true
      };
    }
  }

  confirmationValidator = (control: FormControl): {
    [s: string]: boolean
  } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (control.value !== this.createUserForm.controls.password.value) {
      return {
        confirm: true,
        error: true
      };
    }
  }

  resetCreateUserForm() {
    this.createUserForm.reset();
    this.createUserForm.setValue({
      username: '',
      role: 'RW',
      password: '',
      checkPassword: ''
    });
  }

  handleCreateCancel(): void {
    this.isCreateModalVisible = false;
    this.resetCreateUserForm();
  }

  createUser() {
    this.isButtonLoading = true;
    if (this.createUserForm.valid) {
      this.isCreateModalVisible = false;
      this.submitCreateUserForm();
      const data = {
        name: this.createUserForm.value.username,
        password: this.createUserForm.value.password,
        role: this.createUserForm.value.role
      };
      this.userService.createUser(this.tsdbId, data).subscribe(response => {
        this.isButtonLoading = false;
        console.log('创建用户！', response.message
        // , data, response
        );
        const message = this.nzMessage.loading('正在创建中', {
          nzDuration: 0
        }).messageId;
        if (this.userService.validateResponseCode(response.code)) {
          this.nzMessage.remove(message);
          this.nzMessage.success(response.message);
          this.myEvent.emit();
        } else {
          this.nzMessage.remove(message);
          this.nzMessage.error(response.message);
        }
      });
      this.resetCreateUserForm();
    } else {
      console.log('表单内容不合法!'
      // , this.createUserForm.value
      );
      this.nzMessage.error('请输入正确的用户信息！', { nzDuration: 3000 });
    }
  }

  ngOnInit() {
    this.createUserForm = this.fb.group({
      username: [null, [Validators.required, Validators.maxLength(100)]],
      role: ['RW', [Validators.required]],
      password: [null, [Validators.required, this.passwordValidator, Validators.minLength(8), Validators.maxLength(32)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

}
