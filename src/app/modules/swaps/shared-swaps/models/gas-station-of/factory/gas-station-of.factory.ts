@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  create(
    _aBlockchain: Blockchain,
    _httpClient: HttpClient | FakeHttpClient,
    _providers: any = providers
  ): GasStationOf {
    return new GasStationOf(_aBlockchain, _httpClient, _providers);
  }
}
