import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public IP_HOST:string = "http://localhost:8000";
    public API_HOST:string = this.IP_HOST+"/api";
    
    private headers:any;

    constructor(private http:HttpClient) {}

    public getHeaders() {
        return this.headers;
    }

    public setHeaders(access_token:string, refresh_token:string) {
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${access_token}`,
            'Version': '1.0.0',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
    };

    public getTokens() {
        let access = localStorage.getItem("inservice:office.access_token");
        let refresh = localStorage.getItem("inservice:office.refresh_token");
        console.log(access);
        return {
            access : access,
            refresh : refresh
        }
    }

    public download(url:string) {
        this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = '';
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }
}
