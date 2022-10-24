import { GalleryImageOptions, GalleryPhoto, GalleryPhotos, ImageOptions, Photo } from '@capacitor/camera';
import { FakeCameraPlugin } from './fake-camera-plugin';

describe('FakeCameraPlugin', () => {
  it('new', () => {
    expect(new FakeCameraPlugin()).toBeTruthy();
  });

  it('getPhoto', async () => {
    expect(await new FakeCameraPlugin().getPhoto({} as ImageOptions)).toEqual({} as Photo);
  });

  it('pickImages', async () => {
    expect(await new FakeCameraPlugin().pickImages({} as GalleryImageOptions)).toEqual({
      photos: [{} as GalleryPhoto],
    } as GalleryPhotos);
  });
});
