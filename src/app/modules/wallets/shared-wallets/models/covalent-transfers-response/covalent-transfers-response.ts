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
    return this.response.data.items.map((item: any) => {
      let result: CovalentTransfer;
      if (item.transfers) {
        const transfer = item.transfers[0];
        transfer.gas_spent = item.gas_spent;
        transfer.gas_price = item.gas_price;
        result = new CovalentNoNativeTransfer(transfer, this.response.data.quote_currency, item.successful, this.asset);
      } else {
        result = new CovalentNativeTransfer(
          item,
          this.response.data.quote_currency,
          this.asset,
          this.response.data.address
        );
      }
      return result;
    });
  }
}
