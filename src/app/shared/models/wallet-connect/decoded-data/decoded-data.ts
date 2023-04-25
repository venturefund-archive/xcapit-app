import erc20Abi from '../../../../modules/wallets/shared-wallets/constants/assets-abi/erc20-abi.json';
import routerAbi from '../../../../modules/wallets/shared-wallets/constants/assets-abi/exchange-abi.json';
import * as AbiDecoder from 'abi-decoder';

export class DecodedData {
  constructor(private _anEncodedData: string) {}

  private _decoder() {
    const decoder = AbiDecoder;
    decoder.addABI(erc20Abi);
    decoder.addABI(routerAbi);
    return decoder;
  }
  name(): string {
    return this._decoder().decodeMethod(this._anEncodedData)?.name;
  }

  params(): any {
    return this._decoder().decodeMethod(this._anEncodedData)?.params;
  }
}
