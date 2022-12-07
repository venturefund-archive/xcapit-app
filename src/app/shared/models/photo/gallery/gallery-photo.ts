import { Photo } from '../photo.interface';
import { GalleryPhoto as CapacitorGalleryPhoto } from '@capacitor/camera';
import { ReadAsset } from '../../asset/read-asset/read-asset';
import { BlobOf } from '../../asset/blob-of/blob-of';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../testing/fakes/fake-http.spec';

export class GalleryPhoto implements Photo {
  constructor(
    private readonly _aPhoto: CapacitorGalleryPhoto,
    private readonly _httpClient: HttpClient | FakeHttpClient
  ) {}

  public async path(): Promise<string> {
    return await new ReadAsset(new BlobOf(this._aPhoto.webPath, this._httpClient), new FileReader()).value();
  }
}
