export class FakeTranslateService {
  instant(aTranslationKey: string, params?: any): string {
    return aTranslationKey;
  }
}
