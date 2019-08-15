import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  entity = 'logs';
  endpoint = 'stats';
  constructor(private http: HttpClient) {}
  log(action: string): Observable<any> {
    const logObj = {
      description: action,
      button_id: 'ninguno',
      component_id: 'ninguno'
    };
    return this.http.post(
      `${environment.apiUrl}/${this.endpoint}/${this.entity}`, logObj);
  }
}
