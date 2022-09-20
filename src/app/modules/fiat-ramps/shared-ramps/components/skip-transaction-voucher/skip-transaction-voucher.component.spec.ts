import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { SkipTransactionVoucherComponent } from './skip-transaction-voucher.component';

describe('SkipTransactionVoucherComponent', () => {
  let component: SkipTransactionVoucherComponent;
  let fixture: ComponentFixture<SkipTransactionVoucherComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ SkipTransactionVoucherComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SkipTransactionVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate and close modal when out button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="out_skip_modal"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('secondaryAction');
  });

  it('should close modal when cancel button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="cancel_skip_modal"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
