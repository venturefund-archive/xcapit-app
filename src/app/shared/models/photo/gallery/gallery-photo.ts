import { Photo } from "../photo.interface";
import { GalleryPhoto as CapacitorGalleryPhoto } from '@capacitor/camera';

export class GalleryPhoto implements Photo {
    constructor(private readonly _aPhoto: CapacitorGalleryPhoto) {}
  
    public path(): string {
      return this._aPhoto.webPath;
    }
  }