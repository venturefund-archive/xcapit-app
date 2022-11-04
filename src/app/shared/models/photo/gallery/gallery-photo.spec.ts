import { GalleryPhoto as CapacitorGalleryPhoto } from '@capacitor/camera';
import { Photo } from '../photo.interface';
import { GalleryPhoto } from './gallery-photo';


describe('GalleryPhoto', () => {
  let galleryPhoto: Photo;
  const nativeGalleryPhoto = { webPath: 'testPath' } as CapacitorGalleryPhoto;

  beforeEach(() => {
    galleryPhoto = new GalleryPhoto(nativeGalleryPhoto);
  });
  it('new', () => {
    expect(galleryPhoto).toBeTruthy();
  });

  it('path', () => {
    expect(galleryPhoto.path()).toEqual('testPath');
  });
});
