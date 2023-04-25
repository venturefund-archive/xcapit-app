import { RequestMessage } from '../request-message.interface';
import { isAddress } from 'ethers/lib/utils';
import { HexString } from '../../../hex-string/hex-string';
import { HtmlOf } from '../../html-of/html-of';
import { SessionRequest } from '../../session-request/session-request';

export class TextRequestMessage implements RequestMessage {
  constructor(private _aSessionRequest: SessionRequest) {}
  value(): HTMLElement {
    return new HtmlOf(this.asText()).value();
  }

  asText(): string {
    return this._getSignParamsMessage(this._aSessionRequest.params());
  }

  private _getSignParamsMessage(params: string[]) {
    const message = params.filter((param) => !isAddress(param))[0];

    return new HexString(message).toUtf8();
  }
}
