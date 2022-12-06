import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlobOf } from 'src/app/shared/models/asset/blob-of/blob-of';
import { Base64ImageOf } from '../base-64-image-of';

@Injectable({ providedIn: 'root' })
export class Base64ImageFactory {
  headers = new HttpHeaders({
    Accept: 'image/jpeg',
  });

  constructor(private http: HttpClient) {}

  public async new(_aLink: string) {
    return new Base64ImageOf(new BlobOf(_aLink, this.http, this.headers), new FileReader());
  }
}
