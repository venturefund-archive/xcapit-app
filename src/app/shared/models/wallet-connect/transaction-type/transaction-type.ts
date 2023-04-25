import { DecodedData } from '../decoded-data/decoded-data';
import { transactionType } from '../../../../modules/wallets/shared-wallets/constants/transaction-type';
import { SessionRequest } from '../session-request/session-request';

export class TransactionType {
  constructor(private _aSessionRequest: SessionRequest) {}

  value() {
    let result = null;
    const decodedData = this._decodedData();
    const type = transactionType.filter((type) => type.name === decodedData.name())[0];

    if (type) {
      type.data = decodedData.params();
      result = type;
    }

    return result;
  }

  private _decodedData(): DecodedData {
    return new DecodedData(this._aSessionRequest.transaction().data);
  }

  isApproval(): boolean {
    return this._decodedData().name() === 'approve';
  }
}
