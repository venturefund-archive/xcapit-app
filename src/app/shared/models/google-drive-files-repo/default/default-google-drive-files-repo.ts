import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RawGoogleDriveFile } from '../../google-drive-file/google-drive-file';
import { GoogleDriveFilesRepo } from '../google-drive-files-repo.interface';

export class DefaultGoogleDriveFilesRepo implements GoogleDriveFilesRepo {
  constructor(private http: HttpClient, private _anAccessToken: string) {}

  all(): Promise<RawGoogleDriveFile[]> {
    return this.http
      .get('https://www.googleapis.com/drive/v3/files', {
        params: new HttpParams()
          .set('fields', 'files(id,name,createdTime,modifiedTime)')
          .set('spaces', 'appDataFolder'),
        headers: {
          authorization: `Bearer ${this._anAccessToken}`,
        },
      })
      .pipe(map((res: any) => res.files))
      .toPromise();
  }

  contentOf(id: string): Promise<string> {
    return this.http
      .get(`https://www.googleapis.com/drive/v3/files/${id}`, {
        params: new HttpParams().set('alt', 'media'),
        responseType: 'text',
        headers: {
          authorization: `Bearer ${this._anAccessToken}`,
        },
      })
      .toPromise();
  }
}
