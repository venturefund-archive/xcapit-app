import { FakeTranslateService } from './fake-translate-service';

fdescribe('FakeTranslateService', () => {
  let fakeTranslateService: FakeTranslateService;

  beforeEach(() => {
    fakeTranslateService = new FakeTranslateService();
  });

  it('new', () => {
    expect(fakeTranslateService).toBeTruthy();
  });

  it('instant', () => {
    expect(fakeTranslateService.instant('aTranslationKey', {})).toEqual('translatedText');
  });
});
