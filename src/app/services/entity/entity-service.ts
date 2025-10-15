import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

   constructor(private http:HttpClient, private appService:AppService, private router:Router) { }
   
    getEntity():Observable<Object>  {
    return this.http.get(this.appService.API_HOST+'/office/entity/', {headers:this.appService.getHeaders()});
  }

  addEntity(data:any) {
    return this.http.post(this.appService.API_HOST+'/office/entity/',data,  {headers:this.appService.getHeaders()});
  }

  editEntity(data:any) {
    return this.http.put(this.appService.API_HOST+'/office/entity/',data,  {headers:this.appService.getHeaders()});
  }

  deleteEntity(id:number) {
    return this.http.delete(this.appService.API_HOST+'/office/entity/'+id+'/', {headers:this.appService.getHeaders()});
  }
}
