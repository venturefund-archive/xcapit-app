import { FakeFee } from "../fakes/fake-fee";

export class BlockchainFee { }


fdescribe('BlockchainFee', () => {

  it('new', () => {
    expect(new BlockchainFee(new FakeFee())).toBeTruthy();
  });
});
