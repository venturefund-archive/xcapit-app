import { DefaultGalleryImageOptions } from './default-gallery-image-options';

describe('DefaultGalleryImageOptions', () => {
  let defaultImageOptions: DefaultGalleryImageOptions;
  beforeEach(() => {
    defaultImageOptions = new DefaultGalleryImageOptions();
  });

  it('new', () => {
    expect(defaultImageOptions).toBeTruthy();
  });

  it('value', () => {
    expect(defaultImageOptions.value().limit).toEqual(1);
  });
});
