import { ImageSource } from '../image-source.interface';

export class FakeImageSource implements ImageSource {
  image(): Promise<any> {
    return Promise.resolve({});
  }
}
