import { Photo as CapacitorPhoto } from '@capacitor/camera/dist/esm/definitions';
import { Photo } from '../photo.interface';

export class CameraPhoto implements Photo {
  constructor(private readonly _aPhoto: CapacitorPhoto) {}

  public path(): Promise<string> {
    return Promise.resolve(this._aPhoto.dataUrl);
  }
}
