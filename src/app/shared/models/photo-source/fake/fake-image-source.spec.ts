import { FakePhotoSource } from './fake-photo-source';

describe('FakePhotoSource', () => {
  let imageSource: FakePhotoSource;

  beforeEach(() => {
    imageSource = new FakePhotoSource();
  });

  it('new', () => {
    expect(imageSource).toBeTruthy();
  });

  it('photo', async () => {
    expect((await imageSource.photo()).path()).toEqual('testPath');
  });
});
