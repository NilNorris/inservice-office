import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { };

    login(data:any):Observable<Object> {
      return this.http.post(this.appService.API_HOST+'/signin/', data);
    }
    
}
