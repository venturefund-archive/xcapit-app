import { RequestMessage } from '../request-message.interface';
import { HtmlContentOf } from '../../html-content-of/html-content-of';
import { SessionRequest } from '../../session-request/session-request';

export class HtmlRequestMessage implements RequestMessage {
  constructor(private _aSessionRequest: SessionRequest) {}

  public value(): HTMLElement {
    return new HtmlContentOf(this._jsonParams()).value();
  }

  private _jsonParams() {
    const result = JSON.parse(this._aSessionRequest.params()[1]);
    delete result.types;
    return result;
  }
}
