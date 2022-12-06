import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';

export class BlobOf {
  
  constructor(private readonly anAssetPath: string, private readonly http: HttpClient | FakeHttpClient, private readonly headers? : HttpHeaders) {}

  value(): Promise<Blob> {
    return this.http.get(this.anAssetPath, { responseType: 'blob' as 'json', headers: this.headers}).toPromise();
  }
}
