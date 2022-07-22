import { ProvidersFactory } from './providers.factory';
import { DefaultProviders } from '../default/default-providers';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { HttpClient } from '@angular/common/http';

describe('ProvidersFactory', () => {
  let remoteConfig: jasmine.SpyObj<RemoteConfigService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let providersFactory: ProvidersFactory;

  beforeEach(() => {
    providersFactory = new ProvidersFactory(remoteConfig, httpSpy);
  });
  it('new', () => {
    expect(providersFactory).toBeTruthy();
  });

  it('create', () => {
    expect(providersFactory.create()).toBeInstanceOf(DefaultProviders);
  });
});
