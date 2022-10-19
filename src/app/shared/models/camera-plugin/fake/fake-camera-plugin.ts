import { GalleryImageOptions, GalleryPhoto, GalleryPhotos, ImageOptions, Photo } from '@capacitor/camera';

export class FakeCameraPlugin {
  constructor() {}

  getPhoto(options: ImageOptions): Promise<any> {
    return Promise.resolve({} as Photo);
  }

  pickImages(options: GalleryImageOptions): Promise<any> {
    return Promise.resolve({ photos: [{} as GalleryPhoto] } as GalleryPhotos);
  }
}
