import { UserKycKriptonImages } from '../../interfaces/user-kyc-kripton-images.interface';
import { UserKycKriptonImagesService } from './user-kyc-kripton-images.service';

describe('UserKycKriptonImagesService', () => {
  let service: UserKycKriptonImagesService;
  const expectedPhotos: UserKycKriptonImages = {
    front_document: 'frontIdPhoto',
    back_document: 'backIdPhoto',
    billing: 'selfiePhoto',
  };

  beforeEach(() => {
    service = new UserKycKriptonImagesService();
  });
  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('update', () => {
    expect(service.update({ front_document: 'testPhoto' })).toBeTruthy();
  });

  it('getPhotos', () => {
    service.update(expectedPhotos);
    expect(service.getPhotos()).toEqual(expectedPhotos);
  });

  it('clean', () => {
    service.clean();
    expect(service.getPhotos()).toEqual({});
  })
});
