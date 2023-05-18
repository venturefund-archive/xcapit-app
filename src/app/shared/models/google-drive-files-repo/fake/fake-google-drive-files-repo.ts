import { RawGoogleDriveFile } from '../../google-drive-file/google-drive-file';
import { GoogleDriveFilesRepo } from '../google-drive-files-repo.interface';

export class FakeGoogleDriveFilesRepo implements GoogleDriveFilesRepo {
  constructor(
    private _allReturn: Promise<RawGoogleDriveFile[]> = Promise.resolve([]),
    private _aContentOfReturn: Promise<string> = Promise.resolve('')
  ) {}

  all(): Promise<RawGoogleDriveFile[]> {
    return this._allReturn;
  }

  contentOf(id: string): Promise<string> {
    return this._aContentOfReturn;
  }
}
