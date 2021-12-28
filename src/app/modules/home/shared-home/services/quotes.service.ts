import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  data;

  constructor(private http: CustomHttpService) {}

  getPrice() {
    return this.http.get('https://api1.binance.com/api/v3/ticker/24hr');
  }
}
