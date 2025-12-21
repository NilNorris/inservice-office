import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getNotification():Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/notification/', {headers:this.appService.getHeaders()});
    }


}
