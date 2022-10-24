import { FakeImageSource } from './fake-image-source';

describe('FakeImageSource', () => {
  let imageSource: FakeImageSource;

  beforeEach(() => {
    imageSource = new FakeImageSource();
  });

  it('new', () => {
    expect(imageSource).toBeTruthy();
  });

  it('image', async () => {
    expect(await imageSource.image()).toEqual({});
  });
});
