import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { BlobOf } from '../blob-of/blob-of';

export class ReadAsset {
  constructor(
    private readonly blob: BlobOf,
    private readonly fileReader: FileReader,
  ) {}

  async value(): Promise<string> {
    this.fileReader.readAsDataURL(await this.blob.value());

    return new Promise((resolve, reject) => {
      this.fileReader.onloadend = () => {
        resolve(this.fileReader.result as string);
      };

      this.fileReader.onerror = () => {
        reject('error');
      };
    });
  }
}
