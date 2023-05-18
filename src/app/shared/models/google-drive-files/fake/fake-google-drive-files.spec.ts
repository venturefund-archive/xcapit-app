import { rawGoogleDriveFile } from '../../../fixtures/google-drive-files.raw';
import { GoogleDriveFile } from '../../google-drive-file/google-drive-file';
import { GoogleDriveFiles } from '../google-drive-files.interface';
import { FakeGoogleDriveFiles } from './fake-google-drive-files';

describe('FakeGoogleDriveFiles', () => {
  let googleDriveFiles: GoogleDriveFiles;

  const file = new GoogleDriveFile(rawGoogleDriveFile);

  beforeEach(() => {
    googleDriveFiles = new FakeGoogleDriveFiles(Promise.resolve([file]), Promise.resolve('aContent'));
  });

  it('new', () => {
    expect(googleDriveFiles).toBeTruthy();
  });

  it('new by default', () => {
    expect(new FakeGoogleDriveFiles()).toBeTruthy();
  });

  it('all', async () => {
    expect(await googleDriveFiles.all()).toEqual([file]);
  });

  it('contentOf', async () => {
    expect(await googleDriveFiles.contentOf(file)).toEqual('aContent');
  });
});
