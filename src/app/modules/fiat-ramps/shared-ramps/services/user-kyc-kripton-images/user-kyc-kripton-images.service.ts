import { Injectable } from '@angular/core';
import { UserKycKriptonImages } from '../../interfaces/user-kyc-kripton-images.interface';

@Injectable({
  providedIn: 'root',
})
export class UserKycKriptonImagesService {
  userKycKriptonImages: UserKycKriptonImages = {};

  public update(data): UserKycKriptonImages {
    return Object.assign(this.userKycKriptonImages, data);
  }

  public getPhotos(): UserKycKriptonImages {
    return { ...this.userKycKriptonImages };
  }

  public clean() {
    this.userKycKriptonImages = {}
  }
}
