import { FakeImageSource } from '../image-source/fake/fake-image-source';
import { UploadedImage } from './uploaded-image';

describe('UploadedImage', () => {
  let uploadedImage: UploadedImage;

  beforeEach(() => {
    uploadedImage = new UploadedImage(new FakeImageSource());
  });

  it('new', () => {
    expect(uploadedImage).toBeTruthy();
  });

  it('value', async () => {
    expect(await uploadedImage.value()).toBeTruthy();
  });
});
