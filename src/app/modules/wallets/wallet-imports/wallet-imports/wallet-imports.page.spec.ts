import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { WalletImportsPage } from './wallet-imports.page';

describe('WalletImportsPage', () => {
  let component: WalletImportsPage;
  let fixture: ComponentFixture<WalletImportsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  const itemMethod = [
    {
      img: '/assets/img/wallets/key.svg',
      title: 'wallets.wallet_imports.key.title',
      subtitle: 'wallets.wallet_imports.key.subtitle',
      route: '/wallets/create-first/disclaimer/import',
    },
  ];

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [WalletImportsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletImportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    const title = fixture.debugElement.query(By.css('div.wi__title > ion-text'));
    const subtitle = fixture.debugElement.query(By.css('div.wi__subtitle > ion-text'));
    const [cardEl1, cardEl2] = fixture.debugElement.queryAll(By.css('div.wi__method > app-import-method-options'));

    const support = fixture.debugElement.query(By.css('div.wi__support > ion-text'));

    expect(title.nativeElement.innerHTML).toContain('wallets.wallet_imports.title');
    expect(subtitle.nativeElement.innerHTML).toContain('wallets.wallet_imports.subtitle');

    expect(support.nativeElement.innerHTML).toContain('wallets.wallet_imports.support');
    expect(cardEl1).toBeTruthy();
    expect(cardEl2).toBeTruthy();
  });

  it('should navigate to when event is emited', () => {
    fixture.debugElement.query(By.css('app-import-method-options')).triggerEventHandler('route', itemMethod[0].route);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(itemMethod[0].route);
  });

  it('should navigate to faqs when support link is clicked', () => {
    fixture.debugElement.query(By.css('div.wi__support > ion-text')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/support/faqs/wallet');
  });
});
