import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '@global/layout';
import { AuthService } from '@global/layout/default/auth-service/auth-service';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        redirectTo: '/tsdb/outline',
        pathMatch: 'full'
      },
      {
        path: 'state',
        redirectTo: '/tsdb/outline',
        pathMatch: 'full'
      },
      {
        path: 'tsdb',
        loadChildren: './tsdb/tsdb.module#TsdbModule',
        data: {
          breadcrumb: '时序数据库',
          hasRegion: true,
          product: 'TSDB'
        },
        canActivate: [AuthService]
      },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true})],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
