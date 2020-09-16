import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CustomHttpService } from '../../../../../shared/services/custom-http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiProfilesService {

  crud: CRUD;

  entity = 'profiles';

  constructor(private crudService: CrudService, private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  updatePersonalData(personalData: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.entity}/personal_data`,
      personalData
    );
  }

  profileValid(
    validationType: string = '',
    loading = true
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/${this.entity}/valid`,
      { params: { validation_type: validationType } },
      undefined,
      loading
    );
  }
}
