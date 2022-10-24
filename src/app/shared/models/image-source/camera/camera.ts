import { DefaultImageOptions } from '../../default-image-options/default-image-options';
import { Camera as CapacitorCamera, CameraPlugin, Photo } from '@capacitor/camera';
import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { ImageSource } from '../image-source.interface';

export class Camera implements ImageSource {
  constructor(
    private readonly _imageOptions: DefaultImageOptions = new DefaultImageOptions(),
    private readonly _aPlugin: CameraPlugin | FakeCameraPlugin = CapacitorCamera
  ) {}

  public image(): Promise<Photo> {
    return this._aPlugin.getPhoto(this._imageOptions.value());
  }
}
