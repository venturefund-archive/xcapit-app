import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";
import { BlockchainTokens } from "../blockchain-tokens/blockchain-tokens";
import { Blockchain } from "../blockchain/blockchain";
import { FakeFee } from "../fakes/fake-fee";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { NativeTokenOf } from "../native-token-of/native-token-of";
import { TokenRepo } from "../token-repo/token-repo";
import { DefaultTokens } from "../tokens/tokens";


export class BlockchainFee {

  constructor(private _aFee: Fee, private _aNativeTokenOf: NativeTokenOf) { }
}


fdescribe('BlockchainFee', () => {

  let currentFee: BlockchainFee;

  beforeEach(() => {
    currentFee = new BlockchainFee(
      new FakeFee(100),
      new NativeTokenOf(
        new BlockchainTokens(
          new Blockchain(rawEthereumData),
          new DefaultTokens(new TokenRepo(rawTokensData))
        )
      ));
  });


  it('new', () => {
    expect().toBeTruthy();
  });
});
