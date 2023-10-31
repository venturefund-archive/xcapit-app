import { TransactionRequest } from '@ethersproject/abstract-provider';
import { GasStationOf } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/gas-station-of';


export class NetworkConfig {
  constructor(
    private readonly network: string,
    private readonly _gasStation: GasStationOf
  ) {}

  async value(): Promise<TransactionRequest> {
    return { gasPrice: await this._gasPrice() };
  }

  private async _gasPrice() {
    return (await this._gasStation.price().standard()).weiValue();
  }
}
