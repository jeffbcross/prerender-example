import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Resolve, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { AppComponent } from './app.component';

export class ListResolver implements Resolve<string[]> {
  constructor(private http: Http, @Inject(APP_BASE_HREF) private baseHref: string) {}

  resolve() {
    return this.http.get(`${this.baseHref}/assets/list.json`)
      .map(res => res.json());
  }
}

@Component({
  template: '<h1>Welcome Home</h1>'
})
export class HomeComponent {}

@Component({
  template: `
    <h1>List of Things</h1>
    <ul>
      <li *ngFor="let item of list | async">{{item}}</li>
    </ul>
  `
})
export class ListComponent {
  list: Observable<string[]>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.list = this.route.data.map(data => data[0]);
    if (typeof window !== 'undefined' && window.performance) window.performance.mark('angular-interactive');
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'prerender-example'
    }),
    FormsModule,
    HttpModule,
    RouterModule.forRoot([{
      path: '',
      component: HomeComponent
    },{
      path: 'list',
      component: ListComponent,
      resolve: [ListResolver]
    }])
  ],
  providers: [
    ListResolver,
    {
      provide: APP_BASE_HREF,
      useValue: 'http://localhost:6795'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
