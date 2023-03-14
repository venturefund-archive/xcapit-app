import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserBankDataService {
  userBankData: any;
  
  constructor() {}
  clean() {
    this.userBankData = undefined;
  }

  set(data: any) {
    this.userBankData = { ...data };
  }
}
