import { RequestMessage } from '../request-message.interface';
import { RawSessionRequest } from '../../session-request/raw-session-request.type';
import { isAddress } from 'ethers/lib/utils';
import { HexString } from '../../../hex-string/hex-string';
import { HtmlOf } from '../../html-of/html-of';

export class TextRequestMessage implements RequestMessage {
  constructor(private _aRawSessionRequest: RawSessionRequest) {}
  value(): HTMLElement {
    return new HtmlOf(this.asText()).value();
  }

  asText(): string {
    return this._getSignParamsMessage(this._aRawSessionRequest.params.request.params);
  }

  private _getSignParamsMessage(params: string[]) {
    const message = params.filter((param) => !isAddress(param))[0];

    return new HexString(message).toUtf8();
  }
}
