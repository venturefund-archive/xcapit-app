import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { DefaultImageOptions } from '../../default-image-options/default-image-options';
import { Camera } from './camera';
import { Photo } from '@capacitor/camera';

describe('Camera', () => {
  let camera: Camera;

  beforeEach(() => {
    camera = new Camera(new DefaultImageOptions(), new FakeCameraPlugin());
  });

  it('new with defaults', () => {
    expect(new Camera()).toBeTruthy();
  });

  it('new', () => {
    expect(camera).toBeTruthy();
  });

  it('image', async () => {
    expect(await camera.image()).toEqual({} as Photo);
  });
});
