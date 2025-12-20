import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getCategoryCount():Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/category/count/', {headers:this.appService.getHeaders()});
    }

    getCategory():Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/category/', {headers:this.appService.getHeaders()});
    }

    addCategory(data:any):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.post(this.appService.API_HOST+'/office/category/', data, {headers:headersHttp});
    }

    editCategory(data:any):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.put(this.appService.API_HOST+'/office/category/', data, {headers:headersHttp});
    }

    deleteCategory(id:string):Observable<Object>  {
      return this.http.delete(this.appService.API_HOST+'/office/category/'+id+'/',  {headers:this.appService.getHeaders()});
    }
}
