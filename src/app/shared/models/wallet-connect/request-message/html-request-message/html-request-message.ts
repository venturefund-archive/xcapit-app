import { RawSessionRequest } from '../../session-request/raw-session-request.type';
import { RequestMessage } from '../request-message.interface';
import { HtmlContentOf } from '../../html-content-of/html-content-of';

export class HtmlRequestMessage implements RequestMessage {
  constructor(private _aRawSessionRequest: RawSessionRequest) {}

  public value(): HTMLElement {
    return new HtmlContentOf(this._jsonParams()).value();
  }

  private _jsonParams() {
    const result = JSON.parse(this._aRawSessionRequest.params.request.params[1]);
    delete result.types;
    return result;
  }
}
