import { rawPersonalSignRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { TextRequestMessage } from './text-request-message';
import { HtmlOf } from '../../html-of/html-of';

describe('TextRequestMessage', () => {
  let textRequestMessage: TextRequestMessage;

  beforeEach(() => {
    textRequestMessage = new TextRequestMessage(rawPersonalSignRequest);
  });

  it('new', () => {
    expect(textRequestMessage).toBeTruthy();
  });

  it('asText', () => {
    expect(textRequestMessage.asText()).toEqual('My email is john@doe.com - 1678769188349');
  });

  it('value', () => {
    expect(textRequestMessage.value()).toEqual(new HtmlOf('My email is john@doe.com - 1678769188349').value());
  });
});
