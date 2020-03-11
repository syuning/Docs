import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit, ViewChild, OnChanges, Pipe, PipeTransform, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { MessageService } from '@trident/shared';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { UserService } from '../../../../user.service';

@Component({
  selector: 'app-user-reset',
  templateUrl: './user-reset.component.html',
  // styleUrls: ['./user-reset.component.css']
})
export class UserResetComponent implements OnInit {
  @Input() data: any;
  @Output() myEvent = new EventEmitter();

  tsdbId = this.activedRoute.snapshot.params['id'];
  resetUserForm: FormGroup;
  isResetModalVisible = false;
  isButtonLoading = false;

  constructor(private activedRoute: ActivatedRoute, private message: MessageService, private fb: FormBuilder,
    private userService: UserService, private modalService: NzModalService, private nzMessage: NzMessageService) {}

  submitResetUserForm(): void {
    for (const i in this.resetUserForm.controls) {
      if (this.resetUserForm.controls.hasOwnProperty(i)) {
        this.resetUserForm.controls[i].markAsDirty();
        this.resetUserForm.controls[i].updateValueAndValidity();
      }
    }
  }

  updateResetConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.resetUserForm.controls.checkPassword.updateValueAndValidity());
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

  confirmationResetValidator = (control: FormControl): {
    [s: string]: boolean
  } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (control.value !== this.resetUserForm.controls.password.value) {
      return {
        confirm: true,
        error: true
      };
    }
  }

  showResetModal() {
    this.resetUserForm.setValue({
      username: this.data.name,
      password: '',
      checkPassword: ''
    });
    this.isResetModalVisible = true;
  }

  resetResetUserForm() {
    this.resetUserForm.reset();
    this.resetUserForm.setValue({
      username: '',
      password: '',
      checkPassword: ''
    });
  }

  resetPassword() {
    this.isButtonLoading = true;
    if (this.resetUserForm.valid) {
      this.submitResetUserForm();
      const data = {
        role: 'admin',
        name: this.resetUserForm.value.username,
        password: this.resetUserForm.value.password
      };
      this.userService.resetPassword(this.tsdbId, data).subscribe(response => {
        this.isButtonLoading = false;
        console.log('重置用户密码！', response.message
        // , response
        );
        const message = this.nzMessage.loading('正在修改中', {
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
    } else {
      this.isButtonLoading = false;
      this.nzMessage.error('请核对输入的信息！', {
        nzDuration: 3000
      });
    }
  }

  handleResetCancel(): void {
    this.isButtonLoading = false;
    this.isResetModalVisible = false;
    this.resetResetUserForm();
  }

  ngOnInit() {
    this.resetUserForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, this.passwordValidator, Validators.minLength(8), Validators.maxLength(32)]],
      checkPassword: [null, [Validators.required, this.confirmationResetValidator]],
    });
  }

}
