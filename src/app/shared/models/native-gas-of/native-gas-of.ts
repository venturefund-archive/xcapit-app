import { BigNumber } from 'ethers';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';

export class NativeGasOf implements Fee {
  constructor(private _anERC20Provider: ERC20Provider, private readonly _args: TransactionRequest) {}

  public static create(coin: Coin, args: TransactionRequest): NativeGasOf {
    return new this(new ERC20Provider(coin), args);
  }

  public async value(): Promise<BigNumber> {
    return await this._anERC20Provider.value().estimateGas(this._args);
  }
}
