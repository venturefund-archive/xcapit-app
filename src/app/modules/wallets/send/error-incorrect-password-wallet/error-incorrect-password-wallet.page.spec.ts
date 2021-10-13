import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { ErrorIncorrectPasswordWalletPage } from './error-incorrect-password-wallet.page';

describe('ErrorIncorrectPasswordWalletPage', () => {
  let component: ErrorIncorrectPasswordWalletPage;
  let fixture: ComponentFixture<ErrorIncorrectPasswordWalletPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ErrorIncorrectPasswordWalletPage],
        imports: [IonicModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorIncorrectPasswordWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to Send Summary Page with modal open on goBackToSummary', () => {
    component.goBackToSummary();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith('/wallets/send/summary/retry');
  });
});
