import { AppInitializerFactory } from './app-initializer.factory';
import { of } from 'rxjs';

describe('AppInitializerFactory', () => {
  let translateServiceMock;
  beforeEach(() => {
    translateServiceMock = {
      setDefaultLang: (lang) => null,
      use: (lang) => of({}),
    };
  });

  it('should translate setDefaultLang be called with es', () => {
    const spy = spyOn(translateServiceMock, 'setDefaultLang');
    spy.and.returnValue(null);
    const factory = AppInitializerFactory(translateServiceMock);
    factory();
    expect(spy).toHaveBeenCalledWith('es');
  });

  it('should translate user be called with es', () => {
    const spy = spyOn(translateServiceMock, 'use');
    spy.and.returnValue(of({}));
    const factory = AppInitializerFactory(translateServiceMock);
    factory();
    expect(spy).toHaveBeenCalledWith('es');
  });
});
