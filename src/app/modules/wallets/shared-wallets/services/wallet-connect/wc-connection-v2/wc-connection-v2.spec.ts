import { WCConnectionV2 } from './wc-connection-v2';
import { SignClientInjectable } from '../../../../../../shared/models/wallet-connect/sign-client/injectable/sign-client.injectable';
import { Router } from '@angular/router';
import { FakeNavController } from '../../../../../../../testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';
import { SignClientV2 } from '../../../../../../shared/models/wallet-connect/sign-client/sign-client';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../shared/services/toast/toast.service';
import { DefaultWCUri } from 'src/app/shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { rawWalletConnectUriV1 } from '../../../fixtures/raw-wallet-connect-uri';
import { rawProposal } from '../../../fixtures/raw-proposal.fixture';
import { rawSession } from '../../../fixtures/raw-session.fixture';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/wc-uri.interface';
import { SessionRequestInjectable } from 'src/app/shared/models/wallet-connect/wallet-connect-request/injectable/session-request-injectable';
import { FakeWallet } from '../../../../../swaps/shared-swaps/models/wallet/fake/fake-wallet';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WCStorageService } from '../wc-storage/wc-storage.service';
import { JSONProposal, rawStoredProposal } from '../../../models/fixtures/raw-proposal';

describe('WCConnectionV2', () => {
  let signClientInjectable: jasmine.SpyObj<SignClientInjectable>;
  let signClientV2Spy: jasmine.SpyObj<SignClientV2>;
  let routerSpy: jasmine.SpyObj<Router>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let wcConnectionV2: WCConnectionV2;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let wcRequestInjectableSpy: jasmine.SpyObj<SessionRequestInjectable>;
  let testWCUri: WCUri;
  let fakeWallet: FakeWallet;
  let WCStorageServiceSpy: jasmine.SpyObj<WCStorageService>;
  let walletsFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let triggerPairEvent: () => void;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj(
      'Router',
      {},
      {
        url: '/connection-detail',
      }
    );
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
    });

    translateServiceSpy = jasmine.createSpyObj('TranslateService', {
      instant: '',
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    signClientV2Spy = jasmine.createSpyObj('SignClientV2', {
      on: null,
      pair: Promise.resolve(),
      approve: Promise.resolve({
        topic: 'test_topic',
        acknowledged: () => Promise.resolve(rawSession),
      }),
      disconnect: Promise.resolve(),
    });
    signClientInjectable = jasmine.createSpyObj('SignClientInjectable', {
      create: Promise.resolve(signClientV2Spy),
    });

    wcRequestInjectableSpy = jasmine.createSpyObj('WCRequestInjectable', {
      setRequest: null,
    });

    testWCUri = new DefaultWCUri(rawWalletConnectUriV1);

    WCStorageServiceSpy = jasmine.createSpyObj('WCStorageService', {
      get: Promise.resolve(),
      set: Promise.resolve(),
      remove: Promise.resolve(),
    });

    WCStorageServiceSpy.get.withArgs('current_proposal').and.resolveTo(rawStoredProposal);
    WCStorageServiceSpy.get.withArgs('proposal_wallet_chain_id').and.resolveTo('137');

    fakeWallet = new FakeWallet();

    walletsFactorySpy = jasmine.createSpyObj('WalletsFactory', {
      create: { oneBy: () => Promise.resolve(fakeWallet) },
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: {
        oneById: () => {
          return new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('MATIC');
        },
      },
    });

    triggerPairEvent = () => {
      signClientV2Spy.on.and.callFake((eventName, callback) => {
        if (eventName === 'session_proposal') {
          callback(rawProposal);
        }
      });
    };

    wcConnectionV2 = new WCConnectionV2(
      signClientInjectable,
      routerSpy,
      navControllerSpy,
      translateServiceSpy,
      toastServiceSpy,
      wcRequestInjectableSpy,
      walletsFactorySpy,
      blockchainsFactorySpy,
      WCStorageServiceSpy
    );

    fakeWallet = new FakeWallet(
      Promise.resolve(),
      null,
      '0xtest_wallet',
      new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('ERC20')
    );
  });

  it('new', () => {
    expect(wcConnectionV2).toBeTruthy();
  });

  it('should be paired with uri and it should be possible to get the resulting proposal', async () => {
    triggerPairEvent();
    await wcConnectionV2.pairTo(testWCUri, fakeWallet);
    expect(wcConnectionV2.proposal()).toBeTruthy();
  });

  it('should approve session and it should be posible to get the resulting session and connection status', async () => {
    triggerPairEvent();
    await wcConnectionV2.pairTo(testWCUri, fakeWallet);
    await wcConnectionV2.approveSession();
    expect(wcConnectionV2.session()).toBeTruthy();
    expect(wcConnectionV2.connected()).toBeTrue();
  });

  it('subscribeToAllEvents', async () => {
    await wcConnectionV2.subscribeToAllEvents();
    expect(signClientV2Spy.on).toHaveBeenCalledTimes(2);
  });

  it('should close session', async () => {
    triggerPairEvent();
    await wcConnectionV2.pairTo(testWCUri, fakeWallet);
    await wcConnectionV2.approveSession();
    wcConnectionV2.closeSession();
    expect(wcConnectionV2.connected()).toBeFalse();
  });

  it('should be able to restore pairing if it was already paired and topic is the same', async () => {
    const pairingTopic = JSONProposal.params.pairingTopic;
    await wcConnectionV2.pairTo(testWCUri, fakeWallet, pairingTopic);
    expect(blockchainsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(walletsFactorySpy.create).toHaveBeenCalledTimes(1);
    expect(wcConnectionV2.proposal()).toBeTruthy();
  })
});
