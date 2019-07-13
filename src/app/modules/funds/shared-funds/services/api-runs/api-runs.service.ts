import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiRunsService {
  entity = 'runs';

  constructor(private http: CustomHttpService) {}

  hasActive(): Observable<boolean> {
    return this.http
      .get(`${environment.apiUrl}/${this.entity}/state/active`)
      .pipe(map((res: any) => !!(Array.isArray(res) && res.length)));
  }
}
