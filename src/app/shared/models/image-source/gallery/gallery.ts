import { Camera as CapacitorCamera, CameraPlugin, GalleryPhoto, Photo } from '@capacitor/camera';
import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { ImageSource } from '../image-source.interface';
import { DefaultGalleryImageOptions } from '../../default-image-gallery-options/default-gallery-image-options';

export class Gallery implements ImageSource {
  constructor(
    private readonly _imageOptions: DefaultGalleryImageOptions = new DefaultGalleryImageOptions(),
    private readonly _aPlugin: CameraPlugin | FakeCameraPlugin = CapacitorCamera
  ) {}

  public image(): Promise<GalleryPhoto> {
    return this._aPlugin.pickImages(this._imageOptions.value()).then((res) => res.photos[0]);
  }
}
