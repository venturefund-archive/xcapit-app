import { httpLoaderFactory } from './translate.factory';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

describe('HttpLoaderFactory', () => {
  beforeEach(() => {});

  it('should return a TranslateHttpLoader instance', () => {
    expect(httpLoaderFactory({} as HttpClient)).toBeInstanceOf(TranslateHttpLoader);
  });
});
