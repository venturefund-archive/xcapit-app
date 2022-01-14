import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  constructor(private http: CustomHttpService) {}

  getAllQuotes() {
    return this.http.get(`${environment.binanceApiUrl}/api/v3/ticker/24hr`, undefined, undefined, false);
  }
}
