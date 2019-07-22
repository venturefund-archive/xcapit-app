import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class StateNamesService {
  constructor(private translate: TranslateService) {}

  getStateShowName(state: string) {
    switch (state) {
      case 'active': {
        return this.translate.instant('state_names.active');
      }
      case 'pausado': {
        return this.translate.instant('state_names.pausado');
      }
      case 'toUSDT': {
        return this.translate.instant('state_names.toUSDT');
      }
      case 'toBTC': {
        return this.translate.instant('state_names.toBTC');
      }
      case 'finalizado': {
        return this.translate.instant('state_names.finalizado');
      }
      default: {
        if (state.match(/^to[A-Z]*-NF$/)) {
          return this.translate.instant('state_names.to-NF', {ca: state.match(/to(.*)-NF/)[1]});
        } else {
          return '-';
        }
      }
    }
  }
}
