import { GoogleDriveFile } from '../../google-drive-file/google-drive-file';
import { GoogleDriveFiles } from '../google-drive-files.interface';

export class FakeGoogleDriveFiles implements GoogleDriveFiles {
  constructor(
    private _allReturn: Promise<GoogleDriveFile[]> = Promise.resolve([]),
    private _contentOfReturn: Promise<string> = Promise.resolve('')
  ) {}

  async all(): Promise<GoogleDriveFile[]> {
    return this._allReturn;
  }

  contentOf(file: GoogleDriveFile): Promise<string> {
    return this._contentOfReturn;
  }
}
