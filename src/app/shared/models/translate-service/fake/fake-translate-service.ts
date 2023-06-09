export class FakeTranslateService {
  instant(aTextToTranslate: string, aParams: Object): string {
    return 'translatedText';
  }
}
