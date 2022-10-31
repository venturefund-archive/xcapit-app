import { UploadedPhotoInjectable } from './uploaded-photo.injectable';

describe('UploadedPhotoInjectable', () => {
  it('new', () => {
    expect(new UploadedPhotoInjectable()).toBeTruthy();
  });

  it('create', () => {
    expect(new UploadedPhotoInjectable().create(null)).toBeTruthy();
  });
});
