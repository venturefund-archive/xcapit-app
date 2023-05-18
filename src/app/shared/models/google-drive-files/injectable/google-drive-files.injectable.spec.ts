import { FakeGoogleDriveFilesRepo } from '../../google-drive-files-repo/fake/fake-google-drive-files-repo';
import { GoogleDriveFilesInjectable } from './google-drive-files.injectable';

describe('GoogleDriveFilesInjectable', () => {
  it('create', () => {
    expect(new GoogleDriveFilesInjectable().create(new FakeGoogleDriveFilesRepo())).toBeTruthy();
  });
});
