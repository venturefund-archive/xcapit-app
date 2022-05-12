import { environment } from "src/environments/environment";


export class Slippage {

  constructor(private _rawData: any = environment.ONE_INCH_DEFAULTS) { }

  value(): number {
    return this._rawData.slippage;
  }
}
