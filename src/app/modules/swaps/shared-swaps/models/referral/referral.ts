import { environment } from "src/environments/environment";


export class Referral {

  constructor(private _rawData: any = environment.ONE_INCH_DEFAULTS) { }

  fee(): number {
    return this._rawData.fee;
  }

  walletAddress(): string {
    return this._rawData.referralAddress;
  }
}
