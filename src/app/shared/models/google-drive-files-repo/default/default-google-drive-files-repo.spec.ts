import { HttpClient } from '@angular/common/http';
import { GoogleDriveFilesRepo } from '../google-drive-files-repo.interface';
import { DefaultGoogleDriveFilesRepo } from './default-google-drive-files-repo';
import { of } from 'rxjs';
import { rawGoogleDriveFile } from 'src/app/shared/fixtures/google-drive-files.raw';

describe('DefaultGoogleDriveFilesRepo', () => {
  let googleDriveFilesRepo: GoogleDriveFilesRepo;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient',{
        get: of({files: [rawGoogleDriveFile]})
    })
    googleDriveFilesRepo = new DefaultGoogleDriveFilesRepo(httpSpy, 'token');
  });

  it('new', () => {
    expect(googleDriveFilesRepo).toBeTruthy();
  });

  it('all', async () => {
    expect(await googleDriveFilesRepo.all()).toEqual([rawGoogleDriveFile]);
  });

  it('contentOf', async () => {
    httpSpy.get.and.returnValue(of('aContent'))
    expect(await googleDriveFilesRepo.contentOf('1')).toEqual('aContent');
  });
});
