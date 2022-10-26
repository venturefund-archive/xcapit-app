import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { Gallery } from './gallery';
import { DefaultGalleryImageOptions } from '../../default-image-gallery-options/default-gallery-image-options';
import { GalleryPhoto } from '@capacitor/camera';

describe('Gallery', () => {
  let gallery: Gallery;

  beforeEach(() => {
    gallery = new Gallery(new DefaultGalleryImageOptions(), new FakeCameraPlugin());
  });

  it('new with defaults', () => {
    expect(new Gallery()).toBeTruthy();
  });

  it('new', () => {
    expect(gallery).toBeTruthy();
  });

  it('image', async () => {
    expect(await gallery.image()).toEqual({} as GalleryPhoto);
  });
});
