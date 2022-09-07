import DepositLinkRequest from './deposit-link-request';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';
import { EnvService } from '../../../../../shared/services/env/env.service';
import { DirectaDepositCreationData } from '../../interfaces/directa-deposit-creation-data.interface';

describe('DepositLinkRequest', () => {
  let depositLinkRequest: DepositLinkRequest;
  let depositCreationDataSpy: jasmine.SpyObj<DirectaDepositCreationData>;
  let fakeHttpClient: FakeHttpClient;
  let envServiceSpy: jasmine.SpyObj<EnvService>;

  beforeEach(() => {
    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'api-url',
    });
    fakeHttpClient = new FakeHttpClient(null, { link: 'test-link/hash' });
    depositLinkRequest = new DepositLinkRequest(depositCreationDataSpy, fakeHttpClient, envServiceSpy);
  });

  it('new', () => {
    expect(depositLinkRequest).toBeTruthy();
  });

  it('response', async () => {
    expect(await depositLinkRequest.response().toPromise()).toEqual({ link: 'test-link/hash' });
  });
});
