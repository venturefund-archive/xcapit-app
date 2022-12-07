import { Photo } from '../../photo/photo.interface';
import { PhotoSource } from '../photo-source.interface';

export class FakePhotoSource implements PhotoSource {
  public photo(): Promise<Photo> {
    return Promise.resolve({ path: () => Promise.resolve('testPath') } as Photo);
  }
}
