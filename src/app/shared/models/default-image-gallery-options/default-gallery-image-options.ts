import { GalleryImageOptions } from '@capacitor/camera';

export class DefaultGalleryImageOptions {
  private _defaultOptions: GalleryImageOptions = {
    limit: 1,
  };

  constructor(private readonly _options?: GalleryImageOptions) {}

  public value(): GalleryImageOptions {
    return this._options ?? this._defaultOptions;
  }
}
