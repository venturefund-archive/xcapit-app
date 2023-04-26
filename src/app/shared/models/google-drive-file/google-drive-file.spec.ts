import { GoogleDriveFile, RawGoogleDriveFile } from './google-drive-file';

describe('GoogleDriveFile', () => {
  let googleDriveFile: GoogleDriveFile;
  const rawData: RawGoogleDriveFile = {
    createdTime: new Date(),
    id: '',
    modifiedTime: new Date(),
    name: '',
  };

  beforeEach(() => {
    googleDriveFile = new GoogleDriveFile(rawData);
  });
  it('new', () => {
    expect(googleDriveFile).toBeTruthy();
  });

  it('id ', () => {
    expect(googleDriveFile.id()).toEqual(rawData.id);
  });
});
