import { SignClient as SignClientFactory } from '@walletconnect/sign-client';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { EngineTypes, PairingTypes, SessionTypes, SignClientTypes } from '@walletconnect/types';
import { EnvService } from 'src/app/shared/services/env/env.service';

export class SignClientV2 {
  constructor(private readonly aSignClient: SignClient) {}

  static async create(
    env: EnvService,
    aSignClientFactory: typeof SignClientFactory = SignClientFactory
  ): Promise<SignClientV2> {
    const aSignClient = await aSignClientFactory.init({
      projectId: env.byKey('WC_PUBLIC_PROJECT_ID'),
      relayUrl: env.byKey('WC_RELAY_URL'),
      metadata: {
        name: 'Xcapit Wallet',
        description: 'Xcapit Wallet',
        url: 'https://xcapit.com/',
        icons: ['https://uploads-ssl.webflow.com/62ae2e5d0eca2586c139e2af/633d847e9aa38e40e7e94c9a_logo-xcapit.svg'],
      },
    });
    return new this(aSignClient);
  }

  public on(
    event: SignClientTypes.Event,
    callback: (args: SignClientTypes.EventArguments[SignClientTypes.Event]) => any
  ): void {
    this.aSignClient.on(event, callback);
  }

  public sessions(): SessionTypes.Struct[] {
    return this.aSignClient.session.values;
  }

  public approve(params: EngineTypes.ApproveParams): Promise<{
    topic: string;
    acknowledged: () => Promise<SessionTypes.Struct>;
  }> {
    return this.aSignClient.approve(params);
  }

  public disconnect(params: EngineTypes.DisconnectParams): Promise<void> {
    return this.aSignClient.disconnect(params);
  }

  public pair(params: { uri: string; activatePairing?: boolean }): Promise<PairingTypes.Struct> {
    return this.aSignClient.core.pairing.pair(params);
  }

  public removeListener(event: SignClientTypes.Event): void {
    this.aSignClient.removeListener(event, () => {});
  }

  public respond(params: EngineTypes.RespondParams): Promise<void> {
    return this.aSignClient.respond(params);
  }

  public events(): SignClientTypes.Event[] {
    return [
      'session_update',
      'session_extend',
      'session_ping',
      'session_expire',
      'session_request',
      'session_event',
      'proposal_expire',
    ];
  }
}
