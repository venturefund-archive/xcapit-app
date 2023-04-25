import { RequestMessage } from '../request-message/request-message.interface';

export class RequestData {
  constructor(
    private _aRequestMessage: RequestMessage,
    private _isSignRequest: boolean,
    private _decodedData: any,
    private _isApproval: boolean,
    private _aFeeAmount: number
  ) {}

  message(): RequestMessage {
    return this._aRequestMessage;
  }

  isSignRequest(): boolean {
    return this._isSignRequest;
  }

  decodedData(): any {
    return this._decodedData;
  }

  isApproval(): boolean {
    return this._isApproval;
  }

  fee(): number {
    return this._aFeeAmount;
  }
}
