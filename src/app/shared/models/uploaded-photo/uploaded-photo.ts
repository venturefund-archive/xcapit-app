import { Photo } from '../photo/photo.interface';
import { PhotoSource } from '../photo-source/photo-source.interface';

export class UploadedPhoto {
  constructor(private readonly _aSource: PhotoSource) {}

  public value(): Promise<Photo> {
    return this._aSource.photo();
  }
}
