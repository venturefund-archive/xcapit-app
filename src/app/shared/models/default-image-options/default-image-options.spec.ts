import { DefaultImageOptions } from './default-image-options';

describe('DefaultImageOptions', () => {
  let defaultImageOptions: DefaultImageOptions;
  beforeEach(() => {
    defaultImageOptions = new DefaultImageOptions();
  });

  it('new', () => {
    expect(defaultImageOptions).toBeTruthy();
  });

  it('value', () => {
    expect(defaultImageOptions.value().saveToGallery).toBeFalse();
  });
});
