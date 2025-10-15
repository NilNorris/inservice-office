import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class TipService {
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getTip(offset:number = 0, filter:any | null = null):Observable<Object>  {
      let url = this.appService.API_HOST+'/office/tip/';      
      if (filter) url = url+'?status='+filter.status+'&entity='+filter.entity+'&search='+filter.search;
      if (offset > 0 ) {
        url += '&offset='+offset;
      }
      return this.http.get(url, {headers:this.appService.getHeaders()});
    }

    addTip(data:any) {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.post(this.appService.API_HOST+'/office/tip/', data, {headers:headersHttp});
    }

    getTipDetail(_id:string):Observable<Object>  {
      return this.http.get(this.appService.API_HOST+'/office/tip/detail?_id='+_id, {headers:this.appService.getHeaders()});
    }

    setTip(data:any):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.put(this.appService.API_HOST+'/office/tip/', data, {headers:headersHttp});
    }

    editTip(data:any):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.put(this.appService.API_HOST+'/office/tip/', data, {headers:headersHttp});
    }

    deleteTip(_id:string):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.delete(this.appService.API_HOST+'/office/tip/'+_id+'/', {headers:headersHttp});
    }

    toggleStatus(_id:string):Observable<Object>  {
      let headersHttp = this.appService.getHeaders();
      headersHttp=headersHttp.delete('Content-Type');
      return this.http.put(this.appService.API_HOST+'/office/tip/toggle_status/'+_id+'/', {}, {headers:headersHttp});
    }

}
