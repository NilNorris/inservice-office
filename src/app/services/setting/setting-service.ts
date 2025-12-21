import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getSetting():Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/setting/', {headers:this.appService.getHeaders()});
    }

    setSetting(data:any) {
       return  this.http.put(this.appService.API_HOST+'/office/setting/', data, {headers:this.appService.getHeaders()});
    }

}
