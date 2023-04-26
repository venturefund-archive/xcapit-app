export type RawGoogleDriveFile = {
  createdTime: Date;
  id: string;
  modifiedTime: Date;
  name: string;
};

export class GoogleDriveFile {
  constructor(private _rawGoogleDriveFile: RawGoogleDriveFile) {}

  id() {
    return this._rawGoogleDriveFile.id;
  }
}
