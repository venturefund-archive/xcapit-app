import { FakeCameraPlugin } from '../../camera-plugin/fake/fake-camera-plugin';
import { DefaultImageOptions } from '../../default-image-options/default-image-options';
import { Camera } from './camera';

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

  it('photo', async () => {
    expect((await camera.photo()).path()).toEqual('testPath');
  });
});
