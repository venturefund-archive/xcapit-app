import { GoogleDriveFile, RawGoogleDriveFile } from '../../google-drive-file/google-drive-file';
import { GoogleDriveFilesRepo } from '../../google-drive-files-repo/google-drive-files-repo.interface';
import { GoogleDriveFiles } from '../google-drive-files.interface';

export class DefaultGoogleDriveFiles implements GoogleDriveFiles {
  constructor(private _aDataRepo: GoogleDriveFilesRepo) {}

  async all(): Promise<GoogleDriveFile[]> {
    return (await this._aDataRepo.all()).map((rawFile: RawGoogleDriveFile) => new GoogleDriveFile(rawFile));
  }

  contentOf(file: GoogleDriveFile): Promise<string> {
    return this._aDataRepo.contentOf(file.id());
  }
}
