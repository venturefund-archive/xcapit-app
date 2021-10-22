import { CovalentTransfer } from '../covalent-transfer/covalent-transfer';
import { Coin } from '../../interfaces/coin.interface';
import { CovalentNoNativeTransfer } from '../covalent-no-native-transfer/covalent-no-native-transfer';
import { CovalentNativeTransfer } from '../covalent-native-transfer/covalent-native-transfer';

export class CovalentTransfersResponse {
  private readonly response: any;
  private readonly asset: Coin;

  constructor(response: any, asset: Coin) {
    this.response = response;
    this.asset = asset;
  }

  value(): CovalentTransfer[] {
    return this.response.data.items
      .map((item: any) =>
        item.transfers
          ? item.transfers.map(
              (transfer: any) => new CovalentNoNativeTransfer(transfer, this.response.data.quote_currency)
            )
          : new CovalentNativeTransfer(
              item,
              this.response.data.quote_currency,
              this.asset.value,
              this.response.data.address
            )
      )
      .flat();
  }
}
