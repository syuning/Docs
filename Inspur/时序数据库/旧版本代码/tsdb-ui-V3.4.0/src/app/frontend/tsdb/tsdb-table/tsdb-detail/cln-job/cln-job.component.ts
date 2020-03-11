import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClnJobService } from '../../../cln-job.service';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
import { TsdbDetailComponent } from '../tsdb-detail.component';
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
  cleanJobsManual = [];
  loading = false;
  detailModal: NzModalRef;

  constructor(private modalService: NziModalService, private clnJobService: ClnJobService) {}

  ngOnInit() {
    this.getManualClnJobList();
  }

  getManualClnJobList(): void {
    this.loading = true;
    this.clnJobService.getClnJobList(this.tsdbId, 0, 99).subscribe(
      (response: any) => {
        this.loading = false;
        if (this.clnJobService.validateResponseCode(response.code)) {
          console.log('获取数据清理任务列表！', response.message
          // , response
          );
          this.cleanJobsManual = response.result.data;
        } else {
          console.log('获取数据清理任务列表错误！', response.message
          // , response
          );
        }
      });
  }

  showDetailModal(mTitle: TemplateRef<{}>, mContent: TemplateRef<{}>, mFooter: TemplateRef<{}>) {
    this.detailModal = this.modalService.create({
      nzTitle: mTitle,
      nzContent: mContent,
      nzFooter: mFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => this.detailModal.destroy()
    });
  }

}
