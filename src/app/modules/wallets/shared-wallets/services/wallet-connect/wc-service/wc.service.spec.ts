import { DefaultWCUri } from 'src/app/shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { rawWalletConnectUriV1, rawWalletConnectUriV2 } from '../../../fixtures/raw-wallet-connect-uri';
import { WalletConnectService } from '../wallet-connect.service';
import { WCConnectionV2 } from '../wc-connection-v2/wc-connection-v2';
import { WCService } from './wc.service';

describe('WCService', () => {
  let walletConnectServiceV1: jasmine.SpyObj<WalletConnectService>;
  let wcConnectionV2: jasmine.SpyObj<WCConnectionV2>;
  let wcService: WCService;

  beforeEach(() => {
    walletConnectServiceV1 = jasmine.createSpyObj(
      'WalletConnectServiceV1',
      {},
      {
        connected: true,
      }
    );
    wcConnectionV2 = jasmine.createSpyObj('WCConnectionV2', {
      connected: false,
    });
    wcService = new WCService(walletConnectServiceV1, wcConnectionV2);
  });

  it('new', () => {
    expect(wcService).toBeTruthy();
  });

  it('should initialize and get uri', () => {
    wcService.set(new DefaultWCUri('testUri'));
    expect(wcService.uri().value()).toEqual('testUri');
  });

  it('should not be connected if service is not initialized (no uri setted)', () => {
    expect(wcService.connected()).toBeFalse();
  });

  it('should return connection status based on uri version when uri is initialized', () => {
    wcService.set(new DefaultWCUri(rawWalletConnectUriV1));
    expect(wcService.connected()).toBeTrue();
    wcService.set(new DefaultWCUri(rawWalletConnectUriV2));
    expect(wcService.connected()).toBeFalse();
  });
});
