import { FakePhotoSource } from '../photo-source/fake/fake-photo-source';
import { UploadedPhoto } from './uploaded-photo';

describe('UploadedPhoto', () => {
  let uploadedPhoto: UploadedPhoto;

  beforeEach(() => {
    uploadedPhoto = new UploadedPhoto(new FakePhotoSource());
  });

  it('new', () => {
    expect(uploadedPhoto).toBeTruthy();
  });

  it('value', async () => {
    expect(await uploadedPhoto.value()).toBeTruthy();
  });
});
