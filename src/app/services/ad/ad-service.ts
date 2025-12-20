import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class AdService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getAd(offset:number, filter:any | null = null):Observable<Object>  {
      let url = this.appService.API_HOST+'/office/ad/';
      if (filter) url = url+'?offset='+offset+'&status='+filter.status+'&category='+filter.category+'&search='+(filter.search ?? '');
      if (filter?.sortKey) {
        url += `&sort_key=${filter.sortKey}&sort_dir=${filter.sortDir}`;
      }
      return this.http.get(url, {headers:this.appService.getHeaders()});
    }

    getAdDetail(_id:string):Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/ad/detail?_id='+_id, {headers:this.appService.getHeaders()});
    }

    editAd(data:any):Observable<Object>  {
      return this.http.put(this.appService.API_HOST+'/office/ad/', data, {headers: this.appService.getHeaders()});
    }

    deleteAd(_id:string):Observable<Object>  {
      return this.http.delete(this.appService.API_HOST+'/office/job/'+_id+'/', {headers:this.appService.getHeaders()});
    }
}
