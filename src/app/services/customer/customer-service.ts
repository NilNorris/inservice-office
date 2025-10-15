import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getCustomer(offset:number, filter:any = null):Observable<Object>  {
      let url = this.appService.API_HOST+'/office/customer?offset='+offset;
      if (filter) url = url+'&category='+filter.category+'&entity='+filter.entity+'&status='+filter.status+'&search='+filter.search;
      if (filter?.sortKey) {
        url += `&sort_key=${filter.sortKey}&sort_dir=${filter.sortDir}`;
      }
      return this.http.get(url, {headers:this.appService.getHeaders()});
    }

    setCustomer(data:any):Observable<Object>  {
      return this.http.post(this.appService.API_HOST+'/office/customer/', data, {headers:this.appService.getHeaders()});
    }

    editCustomer(data:any):Observable<Object>  {
      return this.http.post(this.appService.API_HOST+'/office/customer/', data, {headers:this.appService.getHeaders()});
    }

    
    setCustomerCategory(data:any):Observable<Object>  {
      return this.http.put(this.appService.API_HOST+'/office/customer/category/', data, {headers:this.appService.getHeaders()});
    }

    getProfil():Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/profil/', {headers:this.appService.getHeaders()});
    }

}
