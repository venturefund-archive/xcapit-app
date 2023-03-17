import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { SignClientV2 } from './sign-client';
import { RawSession } from '../wc-session/wc-session';
import { EngineTypes, SignClientTypes, SessionTypes } from '@walletconnect/types';
import { rawPeerMetadata } from '../../../../modules/wallets/shared-wallets/fixtures/raw-proposal.fixture';

describe('SignClientV2', () => {
  let signClientV2: SignClientV2;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let signClientClassSpy: jasmine.SpyObj<any>;
  let signClientInstanceSpy: jasmine.SpyObj<SignClient>;
  const pairResponse = {
    topic: '',
    expiry: 123,
    relay: {
      protocol: '',
      data: '',
    },
    active: true,
    peerMetadata: rawPeerMetadata,
  };

  beforeEach(() => {
    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: '',
    });
    envServiceSpy.byKey.withArgs('WC_PUBLIC_PROJECT_ID').and.returnValue('testProjectId');
    envServiceSpy.byKey.withArgs('WC_RELAY_URL').and.returnValue('wss://test.relay.com');

    signClientInstanceSpy = jasmine.createSpyObj(
      'SignClientInstance',
      {
        disconnect: Promise.resolve(),
        respond: Promise.resolve(),
        removeListener: null,
        approve: Promise.resolve({
          topic: '',
          acknowledged: () => Promise.resolve({} as SessionTypes.Struct),
        }),
        on: null,
      },
      {
        session: { values: {} },
        core: { pairing: { pair: (uri: string) => pairResponse } },
      }
    );

    signClientClassSpy = jasmine.createSpyObj('SignClient', {
      init: Promise.resolve(signClientInstanceSpy),
    });

    signClientV2 = new SignClientV2(signClientInstanceSpy);
  });

  it('new', () => {
    expect(signClientV2).toBeTruthy();
  });

  it('create', async () => {
    expect(await SignClientV2.create(envServiceSpy, signClientClassSpy)).toBeInstanceOf(SignClientV2);
  });

  it('sessions', () => {
    expect(signClientV2.sessions()).toEqual({} as RawSession[]);
  });

  it('disconnect', async () => {
    expect(await signClientV2.disconnect({} as EngineTypes.DisconnectParams)).toBeUndefined();
  });

  it('pair', async () => {
    expect(await signClientV2.pair({ uri: '' })).toBeTruthy();
  });

  it('respond', () => {
    expect(
      signClientV2.respond({
        topic: '',
        response: { id: 1, jsonrpc: '', result: {} },
      })
    ).toBeTruthy();
  });

  it('events', () => {
    expect(signClientV2.events().length).toEqual(7);
  });

  it('removeListener', () => {
    expect(signClientV2.removeListener({} as SignClientTypes.Event)).toBeUndefined();
  });

  it('approve', () => {
    expect(signClientV2.approve({} as EngineTypes.ApproveParams)).toBeTruthy();
  });

  it('on', () => {
    expect(signClientV2.on({} as SignClientTypes.Event, () => {})).toBeUndefined();
  });
});
