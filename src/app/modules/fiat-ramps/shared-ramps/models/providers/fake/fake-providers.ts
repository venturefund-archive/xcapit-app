import { Observable } from "rxjs";
import { FiatRampProviderCountry } from "../../../interfaces/fiat-ramp-provider-country";
import { FiatRampProvider } from "../../../interfaces/fiat-ramp-provider.interface";
import { Providers } from '../providers.interface';

export class FakeProviders implements Providers {
  constructor(
    private readonly allResponse: FiatRampProvider[],
    private readonly byAliasResponse: FiatRampProvider,
    private readonly availablesByResponse: Promise<FiatRampProvider[]>,
    private readonly availableDirectaProvidersResponse: Observable<any>
  ) {}

  public all(): FiatRampProvider[] {
    return this.allResponse;
  }

  public byAlias(anAlias: string): FiatRampProvider {
    return this.byAliasResponse;
  }

  public availablesBy(aCountry: FiatRampProviderCountry): Promise<FiatRampProvider[]> {
    return this.availablesByResponse;
  }

  public availableDirectaProviders(aCountry: FiatRampProviderCountry): Observable<any> {
      return this.availableDirectaProvidersResponse;
  }
}
