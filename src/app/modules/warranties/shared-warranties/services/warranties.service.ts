import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class WarrantiesService {
  entity = 'xscrow';

  constructor(private http: CustomHttpService) {}

  createWarranty(data: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/create-warranty`,
      data,
      undefined,
      false
    );
  }

  verifyWarranty(dni: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.entity}/verify-warranty`,
      dni,
      undefined,
      false
    );
  }

}
