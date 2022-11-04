import { Camera as CapacitorCamera, CameraPlugin } from '@capacitor/camera';
import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { DefaultGalleryImageOptions } from '../../default-image-gallery-options/default-gallery-image-options';
import { Photo } from '../../photo/photo.interface';
import { GalleryPhoto } from '../../photo/gallery/gallery-photo';
import { PhotoSource } from '../photo-source.interface';

export class Gallery implements PhotoSource {
  constructor(
    private readonly _imageOptions: DefaultGalleryImageOptions = new DefaultGalleryImageOptions(),
    private readonly _aPlugin: CameraPlugin | FakeCameraPlugin = CapacitorCamera
  ) {}

  public photo(): Promise<Photo> {
    return this._aPlugin.pickImages(this._imageOptions.value()).then((res) => new GalleryPhoto(res.photos[0]));
  }
}
