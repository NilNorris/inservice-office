import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app-service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
    
    constructor(private http:HttpClient, private appService:AppService, private router:Router) { }

    getPayment(offset:number = 0, filter:any | null = null):Observable<Object>  {
      let url = `${this.appService.API_HOST}/office/payment`;      
      if (filter) url = url+'?status='+filter.status+'&service='+filter.service+'&search='+filter.search;
      if (filter?.sortKey) {
        url += `&sort_key=${filter.sortKey}&sort_dir=${filter.sortDir}`;
      }
      if (offset > 0 ) {
        url += '&offset='+offset;
      }
      return this.http.get(url, {headers:this.appService.getHeaders()});
    }

    setStatus(data:any) {
       return  this.http.post(this.appService.API_HOST+'/office/payment/status/', data, {headers:this.appService.getHeaders()});
    }

    setDetailComment(data:any) {
        return  this.http.post(this.appService.API_HOST+'/office/payment/detail_comment/', data, {headers:this.appService.getHeaders()});
     }

    getPaymentDetail(_id:string) {
        return  this.http.get(this.appService.API_HOST+`/office/payment/${_id}/`, {headers:this.appService.getHeaders()});
    }
}
