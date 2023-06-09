import { FakeTranslateService } from "./fake-translate-service";

fdescribe('FakeTranslateService', () => {
  let fakeTranslateService: FakeTranslateService;

  beforeEach(() => {
    fakeTranslateService = new FakeTranslateService();
  });

  it('new', () => {
    expect(fakeTranslateService).toBeTruthy();
  });

  it('instant', async () => {
    await expectAsync(fakeTranslateService.instant('',{})).toBeResolved();
  });
});
