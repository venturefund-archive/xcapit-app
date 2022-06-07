import { Injectable } from '@angular/core';
import { BlobOf } from '../../blob-of/blob-of';
import { ReadAsset } from '../../read-asset/read-asset';
import { CachedAsset } from '../cached-asset';
import { HttpClient } from '@angular/common/http';
import { Filesystem } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class CachedAssetFactory {
  constructor(private http: HttpClient ) {}

  public new(assetPath: string): CachedAsset {
    return new CachedAsset(new ReadAsset(new BlobOf(assetPath, this.http), new FileReader()), Filesystem);
  }
}
