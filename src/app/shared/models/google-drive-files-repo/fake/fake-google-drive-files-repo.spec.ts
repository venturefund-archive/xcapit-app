import { FakeGoogleDriveFilesRepo } from './fake-google-drive-files-repo';
import { rawGoogleDriveFile } from '../../../fixtures/google-drive-files.raw';
import { GoogleDriveFilesRepo } from '../google-drive-files-repo.interface';

describe('FakeGoogleDriveFilesRepo', () => {
  let fakeGoogleDriveFilesRepo: GoogleDriveFilesRepo;
  beforeEach(() => {
    fakeGoogleDriveFilesRepo = new FakeGoogleDriveFilesRepo(
      Promise.resolve([rawGoogleDriveFile]),
      Promise.resolve('a content')
    );
  });

  it('new', () => {
    expect(fakeGoogleDriveFilesRepo).toBeTruthy();
  });

  it('all', async () => {
    expect(await fakeGoogleDriveFilesRepo.all()).toEqual([rawGoogleDriveFile]);
  });

  it('contentOf', async () => {
    expect(await fakeGoogleDriveFilesRepo.contentOf('1')).toEqual('a content');
  });
});
