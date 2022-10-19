import { CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';

export class DefaultImageOptions {
  private _defaultOptions: ImageOptions = {
    source: CameraSource.Camera,
    saveToGallery: false,
    resultType: CameraResultType.DataUrl,
  };
  constructor(private readonly _options?: ImageOptions) {}

  public value(): ImageOptions {
    return this._options ?? this._defaultOptions;
  }
}
