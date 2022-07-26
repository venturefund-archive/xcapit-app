import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

@Injectable({
  providedIn: 'root',
})
export class FinancialEducationService {
  financialEducationApiUrl = 'http://localhost:3000/financial-education/api';
  constructor(private http: CustomHttpService) {}

  getEducationDataOf(anAddress: string): Observable<any> {
    return this.http.get(
      `${this.financialEducationApiUrl}/education-data-of/${anAddress}`,
      undefined,
      undefined,
      false
    );
  }

  getSubmoduleResultOf(aSubmoduleId: number, anAddress: string): Observable<any> {
    return this.http.get(
      `${this.financialEducationApiUrl}/submodule/${aSubmoduleId}/wallet/${anAddress}`,
      undefined,
      undefined,
      false
    );
  }
}
