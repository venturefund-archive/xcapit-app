import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";
import { FakeFee } from "../fakes/fake-fee";


export class BlockchainFee {

  constructor(private _aFee: Fee) { }
}


fdescribe('BlockchainFee', () => {

  it('new', () => {
    expect(new BlockchainFee(new FakeFee(100))).toBeTruthy();
  });
});
