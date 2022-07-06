import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { Providers } from '../providers';
import { ProvidersFactory } from './providers.factory';

describe('ProvidersFactory', () => {
  it('new', () => {
    expect(new ProvidersFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(
      new ProvidersFactory().create(new ProviderDataRepo(rawProvidersData), new FakeHttpClient())
    ).toBeInstanceOf(Providers);
  });
});
