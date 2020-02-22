import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HepicMaterialModule } from './app.material-module';
import { AppComponent } from './app.component';

import { JwtInterceptor } from './helpers';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ChartsModule } from 'ng2-charts';
import {FormsModule} from '@angular/forms';
import {
  MessageContentComponent,
  DetailDialogComponent,
  TabFlowComponent,
  TabLogsComponent,
  TabLokiComponent,
  TabMessagesComponent,
  TabQosComponent,
  TabExportComponent
} from './components';

// import * as components from './components';
@NgModule({
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    AppComponent,
    TabFlowComponent,
    TabLogsComponent,
    TabLokiComponent,
    TabMessagesComponent,
    TabQosComponent,
    TabExportComponent,
    MessageContentComponent,
    DetailDialogComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    HepicMaterialModule,
    ChartsModule,
    NgxJsonViewerModule,
    BrowserModule,
    FormsModule
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
