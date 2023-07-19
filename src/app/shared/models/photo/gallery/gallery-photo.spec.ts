import { GalleryPhoto as CapacitorGalleryPhoto } from '@capacitor/camera';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { Photo } from '../photo.interface';
import { GalleryPhoto } from './gallery-photo';

describe('GalleryPhoto', () => {
  let galleryPhoto: Photo;
  const nativeGalleryPhoto = { webPath: 'testPath' } as CapacitorGalleryPhoto;

  beforeEach(() => {
    galleryPhoto = new GalleryPhoto(nativeGalleryPhoto, new FakeHttpClient(new Blob([])));
  });
  it('new', () => {
    expect(galleryPhoto).toBeTruthy();
  });

  it('path', async () => {
    expect(await galleryPhoto.path()).toEqual('data:application/octet-stream;base64,');
  });
});
