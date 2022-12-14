import { Injectable } from '@angular/core';
import { BlobOf } from '../../blob-of/blob-of';
import { CachedAsset } from '../cached-asset';
import { HttpClient } from '@angular/common/http';
import { Filesystem } from '@capacitor/filesystem';
import { Base64ImageOf } from 'src/app/modules/wallets/shared-wallets/models/base-64-image-of/base-64-image-of';

@Injectable({ providedIn: 'root' })
export class CachedAssetFactory {
  constructor(private http: HttpClient ) {}

  public new(assetPath: string): CachedAsset {
    return new CachedAsset(new Base64ImageOf(new BlobOf(assetPath, this.http), new FileReader()), Filesystem);
  }
}
