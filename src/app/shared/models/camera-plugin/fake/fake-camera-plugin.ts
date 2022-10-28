import { GalleryImageOptions, GalleryPhoto, GalleryPhotos, ImageOptions, Photo } from '@capacitor/camera';

export class FakeCameraPlugin {
  constructor() {}

  getPhoto(options: ImageOptions): Promise<any> {
    return Promise.resolve({ dataUrl: 'testPath' } as Photo);
  }

  pickImages(options: GalleryImageOptions): Promise<any> {
    return Promise.resolve({ photos: [{ webPath: 'testPath' } as GalleryPhoto] } as GalleryPhotos);
  }
}
