import { Lender } from "../../lender/lender.interface";
import { Lenders } from "../lenders.interface";

export class FakeLenders implements Lenders {
  constructor(private readonly _aLender: Lender) {}
  oneByName(aName: string): Lender {
    return this._aLender;
  }
}
