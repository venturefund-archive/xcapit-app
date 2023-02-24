// import { SignClient as SignClientFactory } from '@walletconnect/sign-client';
// import { SignClient } from '@walletconnect/sign-client/dist/types/client';
// import { EnvService } from 'src/app/shared/services/env/env.service';
// import { SignClientV2 } from './sign-client';

// // export class SignClientV2 {
// //   // TODO: No pude importar el tipo de dato SignClient
// //   constructor(private readonly aSignClient: SignClientConstructor, private readonly env: EnvService) {}

// //   init(): Promise<SignClient> {
// //     const response = this.aSignClient.init({
// //       logger: 'debug',
// //       projectId: this._projectId(),
// //       relayUrl: this._relayUrl(),
// //       metadata: {
// //         name: 'Xcapit Wallet',
// //         description: 'Xcapit Wallet',
// //         url: 'https://xcapit.com/',
// //         icons: ['https://uploads-ssl.webflow.com/62ae2e5d0eca2586c139e2af/633d847e9aa38e40e7e94c9a_logo-xcapit.svg'],
// //       },
// //     });
// //     console.log(response);
// //     // TODO: Fix types
// //     return response;
// //   }

// //   private _projectId(): string {
// //     return this.env.byKey('WC_PUBLIC_PROJECT_ID');
// //   }

// //   private _relayUrl(): string {
// //     return this.env.byKey('WC_RELAY_URL');
// //   }
// // }

// fdescribe('SignClientV2', () => {
//   let signClientV2: SignClientV2;
//   let envServiceSpy: jasmine.SpyObj<EnvService>;
//   let signClientClassSpy: jasmine.SpyObj<SignClientConstructor>;
//   let signClientInstanceSpy: jasmine.SpyObj<SignClient>;

//   beforeEach(() => {
//     envServiceSpy = jasmine.createSpyObj('EnvService', {
//       byKey: '',
//     });
//     envServiceSpy.byKey.withArgs('WC_PUBLIC_PROJECT_ID').and.returnValue('testProjectId');
//     envServiceSpy.byKey.withArgs('WC_RELAY_URL').and.returnValue('wss://test.relay.com');

//     signClientClassSpy = jasmine.createSpyObj('SignClient', {
//       init: Promise.resolve(signClientInstanceSpy),
//     });

//     signClientV2 = new SignClientV2(signClientClassSpy, envServiceSpy);
//   });

//   it('new', () => {
//     expect(signClientV2).toBeTruthy();
//   });

//   it('init', async () => {
//     const signClientV2Concrete = await signClientV2.init();
//     console.log(signClientV2Concrete);
//     expect(signClientClassSpy.init).toHaveBeenCalled();
//     expect(signClientV2Concrete).toBeInstanceOf(SignClientFactory);
//   });

//   it('algo', async () => {
//     const signClientV2Concrete = await new SignClientV2(SignClient, envServiceSpy).init();
//     expect(signClientV2Concrete).toBeTruthy();
//   });
// });
