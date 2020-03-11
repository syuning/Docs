import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ClnJobService } from '../../../cln-job.service';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
import { NziModalService} from 'ng-zorro-iop/modal/nzi-modal.service';
import { NzModalRef } from 'ng-zorro-iop/modal/nzi-modal-ref.class';
registerLocaleData(zh);

@Component({
  selector: 'app-cln-job',
  templateUrl: './cln-job.component.html',
  styleUrls: ['./cln-job.component.css']
})
export class ClnJobComponent implements OnInit {
  @Input() tsdbId: string;
  cleanJobs = [];
  loading = false;
  detailModal: NzModalRef;

  constructor(private modalService: NziModalService, private clnJobService: ClnJobService) {}

  ngOnInit() {
    this.getClnJobList();
  }

  getClnJobList(): void {
    this.loading = true;
    this.clnJobService.getClnJobList(this.tsdbId, 0, 99, 'clean').subscribe( (response: any) => {
        this.loading = false;
        if (response.status === 200) {
          this.cleanJobs = response.body.result.data;
        } else {
          this.loading = false;
        }

      // 控制台信息
      console.log('获取数据清理任务列表！' + response.statusText + response.status);
      });
  }

  showDetailModal(mTitle: TemplateRef<{}>, mContent: TemplateRef<{}>, mFooter: TemplateRef<{}>) {
    this.detailModal = this.modalService.create({
      nzTitle: mTitle,
      nzContent: mContent,
      nzFooter: mFooter,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: 700,
      nzOnOk: () => this.detailModal.destroy()
    });
  }

}
