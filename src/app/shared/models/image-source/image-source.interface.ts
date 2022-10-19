import { GalleryPhotos, Photo } from '@capacitor/camera';

export interface ImageSource {
  image: () => Promise<Photo | GalleryPhotos | any>;
}
