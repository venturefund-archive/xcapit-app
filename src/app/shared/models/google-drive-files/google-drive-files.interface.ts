import { GoogleDriveFile } from '../google-drive-file/google-drive-file';

export interface GoogleDriveFiles {
  all: () => Promise<GoogleDriveFile[]>;
  contentOf: (file: GoogleDriveFile) => Promise<string>;
}
