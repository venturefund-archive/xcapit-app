import { Photo as CapacitorPhoto } from '@capacitor/camera/dist/esm/definitions';
import { Photo } from '../photo.interface';
import { CameraPhoto } from './camera-photo';


describe('CameraPhoto', () => {
  let cameraPhoto: Photo;
  const nativePhoto = { dataUrl: 'testPath' } as CapacitorPhoto;

  beforeEach(() => {
    cameraPhoto = new CameraPhoto(nativePhoto);
  });
  it('new', () => {
    expect(cameraPhoto).toBeTruthy();
  });

  it('path', () => {
    expect(cameraPhoto.path()).toEqual('testPath');
  });
});
