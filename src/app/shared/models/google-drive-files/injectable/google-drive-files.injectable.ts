import { Injectable } from '@angular/core';
import { GoogleDriveFilesRepo } from '../../google-drive-files-repo/google-drive-files-repo.interface';
import { DefaultGoogleDriveFiles } from '../default/default-google-drive-files';
import { GoogleDriveFiles } from '../google-drive-files.interface';

@Injectable({ providedIn: 'root' })
export class GoogleDriveFilesInjectable {
  create(aDataRepo: GoogleDriveFilesRepo): GoogleDriveFiles {
    return new DefaultGoogleDriveFiles(aDataRepo);
  }
}
