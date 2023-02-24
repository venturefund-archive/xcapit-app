import { rawWalletConnectUriV1, rawWalletConnectUriV2 } from '../../fixtures/raw-wallet-connect-uri';
import { WalletConnectService } from './wallet-connect.service';
import { WCConnectionV2 } from './wc-connection-v2';
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
    wcService.initialize('testUri');
    expect(wcService.uri().value()).toEqual('testUri');
  });

  it('should not be connected if service is not initialized (no uri setted)', () => {
    expect(wcService.connected()).toBeFalse();
  });

  it('should return connection status based on uri version when uri is initialized', () => {
    wcService.initialize(rawWalletConnectUriV1);
    expect(wcService.connected()).toBeTrue();
    wcService.initialize(rawWalletConnectUriV2);
    expect(wcService.connected()).toBeFalse();
  });
});

// TODO: List:
/*
1. Hacer equivalente de check connection en app.component.ts para cuando se reinicializa la app despues de estar en background
2. Hacer de retrieveConnection si es que se cerro la app pero sigue conectada a una dapp (guardar en storage? Que guardar?)
3. Hacer andar personal sign (y la pantalla de operation detail que esta toda para V1 (duplicar? Factible))
4. Hacer andar ETH sign
5. Tests, tests everywhere
Metele que son pasteles

*/
