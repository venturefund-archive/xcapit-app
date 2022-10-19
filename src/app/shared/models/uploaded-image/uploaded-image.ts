import { ImageSource } from '../image-source/image-source.interface';
import { GalleryPhoto, Photo } from '@capacitor/camera';

export class UploadedImage {
  constructor(private readonly _aSource: ImageSource) {}

  public value(): Promise<Photo | GalleryPhoto> {
    return this._aSource.image();
  }
}
