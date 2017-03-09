import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from "@angular/common";

@NgModule({
  imports: [
	  ServerModule,
	  AppModule
  ],
  bootstrap: [
	  AppComponent
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: 'http://localhost:6795'
  }]
})
export class AppServerModule {}