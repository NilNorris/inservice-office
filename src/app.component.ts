import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from './app-service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    title = 'inservice-backoffice';

  constructor(private appService:AppService) {
    let access = localStorage.getItem('inservice:office.access_token');
    let refresh = localStorage.getItem('inservice:office.refresh_token');
    if (access && refresh) this.appService.setHeaders(access, refresh);
  }
}
