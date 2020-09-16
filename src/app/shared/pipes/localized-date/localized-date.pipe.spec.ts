import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizedDatePipe } from './localized-date.pipe';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';

describe('LocalizedDatePipe', () => {
  describe('Shallow pipe test', () => {
    @Component({
      template: `
        Fecha: {{ this.date | localizedDate }}
      `
    })
    class TestComponent {
      date = '2019-08-08T15:25:16.489000Z';
    }
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let el: HTMLElement;
    let pipe: LocalizedDatePipe;
    let translateServiceMock: any;
    let translateService: any;

    beforeEach(() => {
      registerLocaleData(localeEs);
      registerLocaleData(localeEn);
      translateServiceMock = {
        currentLang: 'es'
      };
      TestBed.configureTestingModule({
        declarations: [TestComponent, LocalizedDatePipe],
        imports: [TranslateModule.forRoot()],
        providers: [
          LocalizedDatePipe,
          DatePipe,
          { provide: TranslateService, useValue: translateServiceMock }
        ]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      el = fixture.nativeElement;
      translateService = TestBed.inject(TranslateService);
      pipe = TestBed.inject(LocalizedDatePipe);
    });

    it('create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('shoud return date in english', () => {
      translateService.currentLang = 'en';
      fixture.detectChanges();
      expect(el.textContent).toContain('Fecha: Aug 8, 2019');
    });

    it('shoud return date in spanish', () => {
      translateService.currentLang = 'es';
      fixture.detectChanges();
      expect(el.textContent).toContain('Fecha: 8 ago. 2019');
    });

    // Isolated pipe test
    it('shoud return Aug 8, 2019', () => {
      translateService.currentLang = 'en';
      expect(pipe.transform('2019-08-08T15:25:16.489000Z')).toBe('Aug 8, 2019');
    });

    it('shoud return 8 ago. 2019', () => {
      translateService.currentLang = 'es';
      expect(pipe.transform('2019-08-08T15:25:16.489000Z')).toBe('8 ago. 2019');
    });
  });
});
