import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiCommissionsService {
  entity = 'commissions';

  constructor(private http: CustomHttpService) {}

  getCommissions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.entity}`);
  }
}
