import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from '@trident/shared';
import { NgZorroIopModule } from 'ng-zorro-iop';
import { NamespaceModule, StorageclassModule, EnvironmentModule } from '@trident/core';

// import components
import { TsdbComponent } from './tsdb.component';
import { TsdbTableComponent } from './tsdb-table/tsdb-table.component';
import { TsdbDetailComponent } from './tsdb-table/tsdb-detail/tsdb-detail.component';
import { TsdbAddComponent } from './tsdb-table/tsdb-add/tsdb-add.component';
import { UserComponent } from './tsdb-table/tsdb-detail/user/user.component';
import { ImExportComponent } from './tsdb-table/tsdb-detail/im-export-data/im-export-data.component';
import { QueryPanelComponent } from './tsdb-table/tsdb-detail/query-panel/query-panel.component';
import { ClnJobComponent } from './tsdb-table/tsdb-detail/cln-job/cln-job.component';
import { OutlineComponent } from '.././tsdb/outline/outline.component';

// import services
import { TsdbService } from './tsdb.service';
import { UserService } from './user.service';
import { ClnJobService } from './cln-job.service';
import { QueryService } from './query.service';
import { ImExportService } from './im-export.service';
import { TsdbMonitorComponent } from './tsdb-table/tsdb-detail/tsdb-monitor/tsdb-monitor.component';
import { UserFormComponent } from './tsdb-table/tsdb-detail/user/user-form/user-form.component';
import { BssService } from './bss.service';
import { QueryFormComponent } from './tsdb-table/tsdb-detail/query-panel/query-form/query-form.component';
import { ClnJobCreateComponent } from './tsdb-table/tsdb-detail/cln-job/cln-job-create/cln-job-create.component';
import { InterceptorProvider } from '@global/shared';

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
    path: 'list/detail/:id/:tabIndex',
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
    component: ClnJobComponent,
    data: {breadcrumb: '数据清理', hasBreadcrumb: false, hasRegion: true}
  },
  {
    path: 'list/detail/:id/iedata',
    component: ImExportComponent,
    data: {breadcrumb: '导入导出', hasBreadcrumb: false, hasRegion: true}
  }
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
    QueryPanelComponent,
    ClnJobComponent,
    TsdbMonitorComponent,
    UserFormComponent,
    OutlineComponent,
    QueryFormComponent,
    ClnJobCreateComponent
  ],
  entryComponents:
  [
    UserFormComponent,
    QueryFormComponent,
    ClnJobCreateComponent
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
    InterceptorProvider
    ]
})
export class TsdbModule {
}
