import { DefaultImageOptions } from '../../default-image-options/default-image-options';
import { Camera as CapacitorCamera, CameraPlugin } from '@capacitor/camera';
import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { Photo } from '../../photo/photo.interface';
import { CameraPhoto } from '../../photo/camera/camera-photo';
import { PhotoSource } from '../photo-source.interface';

export class Camera implements PhotoSource {
  constructor(
    private readonly _imageOptions: DefaultImageOptions = new DefaultImageOptions(),
    private readonly _aPlugin: CameraPlugin | FakeCameraPlugin = CapacitorCamera
  ) {}

  public photo(): Promise<Photo> {
    return this._aPlugin.getPhoto(this._imageOptions.value()).then((res) => new CameraPhoto(res));
  }
}
