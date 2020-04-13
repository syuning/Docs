import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnChanges, Pipe, PipeTransform, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from '@trident/shared';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { UserService } from '../../../../user.service';
import { userTypes } from '../../../../consts';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @Input() data: any;
  @Output() myEvent = new EventEmitter();
  userTypes = userTypes;

  tsdbId = this.activedRoute.snapshot.params['id'];
  editUserForm: FormGroup;
  isEditModalVisible = false;
  loading = false;
  isButtonLoading = false;

  submitEditUserForm(): void {
    for (const i in this.editUserForm.controls) {
      if (this.editUserForm.controls.hasOwnProperty(i)) {
        this.editUserForm.controls[i].markAsDirty();
        this.editUserForm.controls[i].updateValueAndValidity();
      }
    }
  }

  resetEditUserForm() {
    this.editUserForm.reset();
    this.editUserForm.setValue({
      username: this.data.name,
      role: this.data.role
    });
  }

  showEditModal() {
    this.editUserForm.setValue({
      username: this.data.name,
      role: this.data.role,
    });
    this.isEditModalVisible = true;
  }

  editUserInfo() {
    this.isButtonLoading = true;
    if (this.editUserForm.valid) {
      this.submitEditUserForm();
      const data = {
        name: this.data.name,
        role: this.editUserForm.value.role
      };
      this.userService.editUserInfo(this.tsdbId, data).subscribe(response => {
        this.isButtonLoading = false;
        console.log('编辑用户！', response.message
        // , data, response
        );
        const message = this.nzMessage.loading('正在编辑中', {
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
      console.log('表单内容不合法!'
      // , this.editUserForm.value
      );
    }
  }


  handleEditCancel(): void {
    this.isButtonLoading = false;
    this.isEditModalVisible = false;
    this.resetEditUserForm();
  }

  constructor(private activedRoute: ActivatedRoute, private message: MessageService, private fb: FormBuilder,
    private userService: UserService, private modalService: NzModalService, private nzMessage: NzMessageService) {}

  ngOnInit() {
    this.editUserForm = this.fb.group({
      username: [{
          value: null,
          disabled: true
        },
        [Validators.required]
      ],
      role: ['RW', [Validators.required]]
    });
  }

}
