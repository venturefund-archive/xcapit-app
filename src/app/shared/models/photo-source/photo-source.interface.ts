import { Photo } from '../photo/photo.interface';

export interface PhotoSource {
  photo: () => Promise<Photo>;
}
