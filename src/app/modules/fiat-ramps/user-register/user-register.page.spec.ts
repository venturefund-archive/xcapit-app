import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

import { UserRegisterPage } from './user-register.page';

describe('UserRegisterPage', () => {
  let component: UserRegisterPage;
  let fixture: ComponentFixture<UserRegisterPage>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
    TestBed.configureTestingModule({
      declarations: [UserRegisterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const providerEl = fixture.debugElement.query(By.css('div.ur__container__provider > ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.ur__container__icon > img'));
    const titleEl = fixture.debugElement.query(By.css('div.ur__container__title > ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('div.ur__container__subtitle > ion-text'));
    const [cardEl1, cardEl2] = fixture.debugElement.queryAll(
      By.css('div.ur__container__card > app-user-register-step-card')
    );
    const disclaimerImgEl = fixture.debugElement.query(By.css('div.ur__container__disclaimer > img'));
    const disclaimerContentEl = fixture.debugElement.query(By.css('div.ur__container__disclaimer > ion-text'));

    expect(providerEl.nativeElement.innerHTML).toContain('fiat_ramps.user_register.provider');
    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.user_register.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('fiat_ramps.user_register.subtitle');
    expect(iconEl.attributes.src).toContain('assets/img/provider-logos/KriptonMarket.svg');
    expect(disclaimerImgEl.attributes.src).toContain('assets/ux-icons/ux-inbox.svg');
    expect(disclaimerContentEl).toBeTruthy();
    expect(cardEl1).toBeTruthy();
    expect(cardEl2).toBeTruthy();
  });

  it('should open browser when link was clicked', () => {
    const disclaimerLinkEl = fixture.debugElement.query(By.css('div.ur__container__disclaimer > ion-text > span'));

    disclaimerLinkEl.nativeElement.click();

    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://cash.kriptonmarket.com/privacy' });
  });
});
