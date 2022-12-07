import { Photo } from '../photo.interface';
import { GalleryPhoto as CapacitorGalleryPhoto } from '@capacitor/camera';
import { BlobOf } from '../../asset/blob-of/blob-of';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../testing/fakes/fake-http.spec';
import { Base64ImageOf } from 'src/app/modules/wallets/shared-wallets/models/base-64-image-of/base-64-image-of';

export class GalleryPhoto implements Photo {
  constructor(
    private readonly _aPhoto: CapacitorGalleryPhoto,
    private readonly _httpClient: HttpClient | FakeHttpClient
  ) {}

  public async path(): Promise<string> {
    return await new Base64ImageOf(new BlobOf(this._aPhoto.webPath, this._httpClient), new FileReader()).value();
  }
}
