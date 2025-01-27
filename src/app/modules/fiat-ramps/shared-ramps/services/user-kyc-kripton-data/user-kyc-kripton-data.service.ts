import { Injectable } from '@angular/core';
import { UserKycKriptonData } from '../../interfaces/user-kyc-kripton-data.interface';

@Injectable({ providedIn: 'root' })
export class UserKycKriptonDataService {
  userKycKriptonData: UserKycKriptonData;
  constructor() {}

  public updateData(data: any) {
    this.userKycKriptonData = { ...this.userKycKriptonData, ...data };
  }

  public update(key: string, value: any) {
    this.userKycKriptonData[key] = value;
  }

  public getData() {
    return { ...this.userKycKriptonData };
  }

  public clean() {
    this.userKycKriptonData = undefined;
  }
}
