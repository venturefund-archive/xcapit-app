import { HttpClient } from '@angular/common/http';
import { Base64ImageFactory } from './base-64-image-factory';


describe('Base64ImageFactory', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {});

  it('create', () => {
    expect(new Base64ImageFactory(httpClientSpy)).toBeTruthy();
  });

  it('new', () => {
    expect(new Base64ImageFactory(httpClientSpy).new('')).toBeTruthy();
  });
});
