import { Injectable } from '@angular/core';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ApiReferralsService {
  crud: CRUD;

  entity = 'referrals';

  constructor(
    private crudService: CrudService,
    private http: CustomHttpService,
    private loadingService: LoadingService
  ) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getUserReferrals(options: any = {}): Observable<any> {
    this.loadingService.disabled();
    return this.http
      .get(`${environment.apiUrl}/${this.entity}/user_referrals`, {
        params: options
      })
      .pipe(finalize(() => this.loadingService.enabled()));
  }
}
