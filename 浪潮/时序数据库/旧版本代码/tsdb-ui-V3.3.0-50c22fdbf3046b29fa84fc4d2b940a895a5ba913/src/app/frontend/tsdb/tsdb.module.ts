import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService, MessageService } from '@trident/shared';
import { NgZorroIopModule } from 'ng-zorro-iop';
import { NamespaceModule, StorageclassModule, EnvironmentModule } from '@trident/core';

// import components
import { TsdbComponent } from './tsdb.component';
import { TsdbTableComponent } from './tsdb-table/tsdb-table.component';
import { TsdbDetailComponent } from './tsdb-table/tsdb-detail/tsdb-detail.component';
import { TsdbAddComponent } from './tsdb-table/tsdb-add/tsdb-add.component';
import { UserComponent } from './tsdb-table/user/user.component';
import { ImExportComponent } from './tsdb-table/im-export-data/im-export-data.component';
import { ImExportTaskDetailComponent } from './tsdb-table/im-export-data/im-export-detail/im-export-detail.component';
import { QueryPanelComponent } from './tsdb-table/query-panel/query-panel.component';
import { QueryTemplateComponent } from './tsdb-table/query-panel/query-template/query-template.component';
import { ClnJobManualComponent } from './tsdb-table/cln-job-manual/cln-job-manual.component';
import { ClnJobAutoComponent } from './tsdb-table/cln-job-auto/cln-job-auto.component';
import { OutlineComponent } from '.././tsdb/outline/outline.component';

// import services
import { TsdbService } from './tsdb.service';
import { UserService } from './user.service';
import { ClnJobService } from './cln-job.service';
import { QueryService } from './query.service';
import { ImExportService } from './im-export.service';
import { TsdbMonitorComponent } from './tsdb-table/tsdb-monitor/tsdb-monitor.component';
import { UserModalComponent } from './tsdb-table/user/user-create/user-create.component';
import { UserEditComponent } from './tsdb-table/user/user-edit/user-edit.component';
import { UserResetComponent } from './tsdb-table/user/user-reset/user-reset.component';
import { TemplateAddComponent } from './tsdb-table/query-panel/query-template/template-add/template-add.component';
import { BssService } from './bss.service';

const tsdbRoutes: Routes = [
  {
    path: '',
    redirectTo: 'outline',
    data: {hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list', component: TsdbComponent,
    data: {breadcrumb: '实例列表', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'outline', component: OutlineComponent,
    data: {breadcrumb: '概览', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'add', component: TsdbAddComponent,
    data: {breadcrumb: '创建数据库', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id',
    component: TsdbDetailComponent,
    data: {breadcrumb: '数据库详情', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id/query',
    component: QueryPanelComponent,
    data: {breadcrumb: '查询面板', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id/clean-manual',
    component: ClnJobManualComponent,
    data: {breadcrumb: '手动清理', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id/clean-auto',
    component: ClnJobAutoComponent,
    data: {breadcrumb: '自动清理', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id/iedata',
    component: ImExportComponent,
    data: {breadcrumb: '导入导出', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id/iedata/:task_id',
    component: ImExportTaskDetailComponent,
    data: {breadcrumb: '任务详情', hasBreadcrumb: false, hasRegion: true}
  },
  // {
  //   path: 'detail/:id/query/:id/templates',
  //   component: QueryTemplateComponent,
  //   data: {breadcrumb: '模板管理', hasBreadcrumb: false}
  // },
  // {
  //   path: ':id/user',
  //   component: UserComponent,
  //   data: {breadcrumb: '用户列表', hasBreadcrumb: false}
  // },
  // {
  //   path: 'detail/:id/user/add', component: UserAddComponent,
  //   data: {breadcrumb: '创建用户', hasBreadcrumb: false}
  // },
  // {
  //   path: 'monitor/:id/label/:label',
  //   component: TsdbMonitorComponent,
  //   data: {breadcrumb: '实例监控', hasBreadcrumb: false}
  // }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgxEchartsModule,
    RouterModule.forChild(tsdbRoutes),
    NgZorroAntdModule,
    NgZorroIopModule,
    NamespaceModule,
    StorageclassModule,
    EnvironmentModule,
    HttpClientModule
  ],
  declarations: [
    TsdbComponent,
    TsdbTableComponent,
    TsdbDetailComponent,
    TsdbAddComponent,
    UserComponent,
    ImExportComponent,
    ImExportTaskDetailComponent,
    QueryPanelComponent,
    QueryTemplateComponent,
    ClnJobManualComponent,
    ClnJobAutoComponent,
    TsdbMonitorComponent,
    UserModalComponent,
    UserEditComponent,
    UserResetComponent,
    TemplateAddComponent,
    OutlineComponent
  ],
  entryComponents:
  [
    UserModalComponent,
    UserEditComponent,
    UserResetComponent
  ],
  exports: [],
  providers:
  [
    TsdbService,
    BssService,
    UserService,
    ClnJobService,
    ImExportService,
    QueryService,
    MessageService,
     {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
    ]
})
export class TsdbModule {
}
