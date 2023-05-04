import { rawGoogleDriveFile } from '../../fixtures/google-drive-files.raw';
import { GoogleDriveFile } from './google-drive-file';

describe('GoogleDriveFile', () => {
  let googleDriveFile: GoogleDriveFile;

  beforeEach(() => {
    googleDriveFile = new GoogleDriveFile(rawGoogleDriveFile);
  });

  it('new', () => {
    expect(googleDriveFile).toBeTruthy();
  });

  it('id ', () => {
    expect(googleDriveFile.id()).toEqual(rawGoogleDriveFile.id);
  });
});
