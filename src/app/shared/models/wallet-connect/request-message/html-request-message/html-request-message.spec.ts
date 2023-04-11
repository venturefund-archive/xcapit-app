import { HtmlRequestMessage } from './html-request-message';
import { RequestMessage } from '../request-message.interface';

describe('HtmlRequestMessage', () => {
  let htmlRequestMessage: RequestMessage;
  const simpleHtmlMessageRequest = {
    id: 1681236104977555,
    topic: 'c1e7a3c687b70d06c114be46d08e279be355c814c4614dc049d20dc7257e1782',
    params: {
      request: {
        method: 'eth_signTypedData',
        params: [
          '0x917686f79e211c24b8426d169fb77161fbe20b07',
          '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail"}',
        ],
      },
      chainId: 'eip155:80001',
    },
  };

  beforeEach(() => {
    htmlRequestMessage = new HtmlRequestMessage(simpleHtmlMessageRequest);
  });

  it('new', () => {
    expect(htmlRequestMessage).toBeTruthy();
  });

  it('value', () => {
    const expectedHtml = `<div><div style="margin-left: 16px;"><span style="font-weight: 700;">primaryType: </span><span>Mail</span></div></div>`;
    expect(htmlRequestMessage.value().outerHTML.toString()).toEqual(expectedHtml);
  });
});
