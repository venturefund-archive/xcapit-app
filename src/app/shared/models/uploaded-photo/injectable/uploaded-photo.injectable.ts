import { Injectable } from '@angular/core';
import { UploadedPhoto } from '../uploaded-photo';
import { PhotoSource } from '../../photo-source/photo-source.interface';

@Injectable({ providedIn: 'root' })
export class UploadedPhotoInjectable {
  create(aPhotoSource: PhotoSource): UploadedPhoto {
    return new UploadedPhoto(aPhotoSource);
  }
}
