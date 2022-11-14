import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { Gallery } from './gallery';
import { DefaultGalleryImageOptions } from '../../default-image-gallery-options/default-gallery-image-options';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { GalleryPhoto } from '../../photo/gallery/gallery-photo';

describe('Gallery', () => {
  let gallery: Gallery;

  beforeEach(() => {
    gallery = new Gallery(new FakeHttpClient(new Blob([])), new DefaultGalleryImageOptions(), new FakeCameraPlugin());
  });

  it('new with defaults', () => {
    expect(new Gallery(new FakeHttpClient())).toBeTruthy();
  });

  it('new', () => {
    expect(gallery).toBeTruthy();
  });

  it('photo', async () => {
    expect(await gallery.photo()).toBeInstanceOf(GalleryPhoto);
  });
});
