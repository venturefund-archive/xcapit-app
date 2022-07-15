import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { ProvidersFactory } from './providers.factory';
import { DefaultProviders } from '../default/default-providers';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

describe('ProvidersFactory', () => {
  let remoteConfig: jasmine.SpyObj<RemoteConfigService>;
  it('new', () => {
    expect(new ProvidersFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(new ProvidersFactory().create(remoteConfig, new FakeHttpClient())).toBeInstanceOf(DefaultProviders);
  });
});
