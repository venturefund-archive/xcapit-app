import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiTacService } from '../api-tac/api-tac.service';

@Injectable({
  providedIn: 'root'
})
export class TacHelperService {

  urlToAccess: string;

  constructor(
    private apiTac: ApiTacService,
    private navController: NavController
  ) {}

  isTaCAccepted(url: string): Observable<boolean> {
    this.urlToAccess = url;
    return this.apiTac.crud.get().pipe(
      map(tac => {
        const isTermsAndConditionsAccepted = tac.accepted;
        if (!isTermsAndConditionsAccepted) {
          this.navController.navigateForward(['/terms-and-conditions/accept'], { replaceUrl: true });
        }
        return isTermsAndConditionsAccepted;
      })
    );
  }
}
