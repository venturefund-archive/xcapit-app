import { rawGoogleDriveFile } from '../../../fixtures/google-drive-files.raw';
import { GoogleDriveFile } from '../../google-drive-file/google-drive-file';
import { FakeGoogleDriveFilesRepo } from '../../google-drive-files-repo/fake/fake-google-drive-files-repo';
import { DefaultGoogleDriveFiles } from './default-google-drive-files';

describe('DefaultGoogleDriveFiles', () => {
  let googleDriveFiles: DefaultGoogleDriveFiles;

  beforeEach(() => {
    googleDriveFiles = new DefaultGoogleDriveFiles(
      new FakeGoogleDriveFilesRepo(Promise.resolve([rawGoogleDriveFile]), Promise.resolve('aContent'))
    );
  });

  it('new', () => {
    expect(googleDriveFiles).toBeTruthy();
  });

  it('all', async () => {
    expect(await googleDriveFiles.all()).toEqual([new GoogleDriveFile(rawGoogleDriveFile)]);
  });

  it('contentOf', async () => {
    expect(await googleDriveFiles.contentOf(new GoogleDriveFile(rawGoogleDriveFile))).toEqual('aContent');
  });
});
