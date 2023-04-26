import { RawGoogleDriveFile } from '../google-drive-file/google-drive-file';

export interface GoogleDriveFilesRepo {
  all: () => Promise<RawGoogleDriveFile[]>;
  contentOf: (id: string) => Promise<string>;
}
