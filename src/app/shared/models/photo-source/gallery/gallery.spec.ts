import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { Gallery } from './gallery';
import { DefaultGalleryImageOptions } from '../../default-image-gallery-options/default-gallery-image-options';

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

  it('photo', async () => {
    expect((await gallery.photo()).path()).toEqual('testPath');
  });
});
