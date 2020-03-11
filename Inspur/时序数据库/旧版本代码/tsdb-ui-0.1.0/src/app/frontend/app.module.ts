import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroIopModule } from 'ng-zorro-iop';
import { KeycloakModule } from 'keycloak-iop';
import { CommonService, WebsocketService, SharedModule } from '@global/shared';
import { AppConfig, initializer } from './app-init';
import { NavAsideModule, NavHeaderModule, DefaultModule } from '@global/layout';
import { BreadcrumbModule } from '@trident/core';
import { TsdbService } from './tsdb/tsdb.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

@NgModule({
  imports: [
    AppRoutingModule,
    NoopAnimationsModule,
    NavHeaderModule,
    NavAsideModule,
    NgZorroAntdModule,
    SharedModule,
    BreadcrumbModule,
    KeycloakModule,
    NgZorroIopModule,
    DefaultModule,
    TranslateModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    TsdbService,
    CommonService,
    WebsocketService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [AppConfig, CommonService],
      multi: true,
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
export function createTranslateHttpLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: 'assets/translate/common/', suffix: ',json'},
    {prefix: 'assets/translate/outline/', suffix: '.json'},
  ]);
}

