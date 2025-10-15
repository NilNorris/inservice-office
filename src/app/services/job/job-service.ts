import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

     getJob(offset:number, filter:any | null = null):Observable<Object>  {
      let url = this.appService.API_HOST+'/office/job/';
      if (filter) url = url+'?offset='+offset+'&status='+filter.status+'&search='+(filter.search ?? '');
      return this.http.get(url, {headers:this.appService.getHeaders()});
    }

    getJobDetail(_id:string):Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/job/detail?_id='+_id, {headers:this.appService.getHeaders()});
    }

    setJob(data:any):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.post(this.appService.API_HOST+'/office/job/', data, {headers:headersHttp});
    }

    editJob(data:any):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.put(this.appService.API_HOST+'/office/job/', data, {headers:headersHttp});
    }

    deleteJob(_id:string):Observable<Object>  {
      return this.http.delete(this.appService.API_HOST+'/office/job/'+_id+'/', {headers:this.appService.getHeaders()});
    }

}
