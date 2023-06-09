export class FakeTranslateService {
  instant(aTranslationKey: string, params: Object): string {
    return 'translatedText';
  }
}
