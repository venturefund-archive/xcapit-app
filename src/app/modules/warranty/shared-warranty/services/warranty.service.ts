import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class WarrantyService {
  entity = 'scrow';

  constructor(private http: CustomHttpService) {}

  createWarranty(data: any): Observable<any> {
    // TODO: Reemplazar la ruta por environment.apiUrl
    return this.http.post(
      `localhost:9050/v1/api/${this.entity}/create-warranty`,
      data,
      undefined,
      false
    );
  }

}
