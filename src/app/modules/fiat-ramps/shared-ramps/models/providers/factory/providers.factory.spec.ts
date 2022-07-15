import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { ProvidersFactory } from './providers.factory';
import { DefaultProviders } from '../default/default-providers';

describe('ProvidersFactory', () => {
  it('new', () => {
    expect(new ProvidersFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(new ProvidersFactory().create(new FakeHttpClient(), rawProvidersData)).toBeInstanceOf(DefaultProviders);
  });
});
