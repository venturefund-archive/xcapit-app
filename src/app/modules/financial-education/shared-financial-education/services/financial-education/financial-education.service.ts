import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { EnvService } from '../../../../../shared/services/env/env.service';

@Injectable({
  providedIn: 'root',
})
export class FinancialEducationService {
  private entity = 'financial_education';
  private endpoint = `${this.env.byKey('apiUrl')}/${this.entity}`;
  constructor(private http: CustomHttpService, private env: EnvService) {}

  getEducationDataOf(anAddress: string): Observable<any> {
    return this.http.get(`${this.endpoint}/education-data-of/${anAddress}`, undefined, undefined, false);
  }

  getSubmoduleResultOf(aSubmoduleId: number, anAddress: string): Observable<any> {
    return this.http.get(
      `${this.endpoint}/submodule-data-of/${aSubmoduleId}/${anAddress}`,
      undefined,
      undefined,
      false
    );
  }
}
