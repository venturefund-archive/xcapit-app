import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiWebflowService {
  entity = 'webflow';

  constructor(private http: HttpClient) {}

  getNews(options: any = {}): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/`, {
      params: options,
    });
  }
}
