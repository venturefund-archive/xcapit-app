import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";
import { BlockchainTokens } from "../blockchain-tokens/blockchain-tokens";
import { FakeFee } from "../fakes/fake-fee";
import { NativeTokenOf } from "../native-token-of/native-token-of";


export class BlockchainFee {

  constructor(private _aFee: Fee) { }
}


fdescribe('BlockchainFee', () => {

  let blockchainFee: BlockchainFee;

  beforeEach(() => {
    new BlockchainTokens(
      new Blockchain(rawEthereumData),
      new DefaultTokens(new TokenRepo(rawTokensData))
    )
  });


  it('new', () => {
    expect(new BlockchainFee(new FakeFee(100), new NativeTokenOf(new ))).toBeTruthy();
  });
});
