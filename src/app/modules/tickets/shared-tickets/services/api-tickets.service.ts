import { Injectable } from '@angular/core';
import { CustomHttpService } from '../../../../shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiTicketsService {
  entity = 'tickets';

  constructor(private http: CustomHttpService) {}

  createTicket(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.entity}/`, data, undefined, false);
  }
}
