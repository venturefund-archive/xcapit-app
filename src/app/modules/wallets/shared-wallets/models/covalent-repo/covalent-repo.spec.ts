import { EnvService } from 'src/app/shared/services/env/env.service';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentRepo } from './covalent-repo';


fdescribe('CovalentRepo', () => {
  let covalentRepo: CovalentRepo;
  let aToken: jasmine.SpyObj<RawToken>;
  let envSpy: jasmine.SpyObj<EnvService>;
  const inAddress = '';

  beforeEach(() => {
    envSpy = jasmine.createSpyObj('EnvService', { byKey: 'http://covalentUrl/' });
    covalentRepo = new CovalentRepo(new FakeHttpClient(true), envSpy);
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(covalentRepo).toBeTruthy();
  });

  it('transfersOf', async () => {
    const response = await covalentRepo.transfersOf(aToken, inAddress).toPromise();
    expect(response).toBeTruthy();
  });
});
