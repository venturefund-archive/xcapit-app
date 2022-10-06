import { Injectable } from "@angular/core";
import { UserKycKriptonData } from "../../interfaces/user-kyc-kripton-data.interface";

@Injectable({
    providedIn: 'root'
  })
  export class UserKycKriptonDataService {
  
    userKycKriptonData: UserKycKriptonData;
    constructor() { }
  
    public updateData(data: UserKycKriptonData) {
      this.userKycKriptonData = data;
    }
  
    public getData() {
      return { ...this.userKycKriptonData };
    }

    public clean(){
      this.userKycKriptonData = undefined;
    }
  }