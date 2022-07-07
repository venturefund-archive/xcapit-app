import { Injectable } from '@angular/core';
import { MODULES_CRYPTO } from 'src/app/modules/financial-education/shared-financial-education/constants/crypto';
import { MODULES_FINANCE } from 'src/app/modules/financial-education/shared-financial-education/constants/finance';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  modules = [...MODULES_CRYPTO, ...MODULES_FINANCE];
  constructor() {}

  getModules() {
    return this.modules;
  }

  getModuleByTab(tab: string) {
    if (tab === 'finance') {
      return MODULES_FINANCE;
    } else {
      return MODULES_CRYPTO;
    }
  }
}
