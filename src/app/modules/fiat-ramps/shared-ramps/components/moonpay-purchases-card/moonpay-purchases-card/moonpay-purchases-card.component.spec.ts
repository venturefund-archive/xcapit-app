import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { MoonpayPurchasesCardComponent } from './moonpay-purchases-card.component';

describe('MoonpayPurchasesCardComponent', () => {
  let component: MoonpayPurchasesCardComponent;
  let fixture: ComponentFixture<MoonpayPurchasesCardComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [MoonpayPurchasesCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoonpayPurchasesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open 2PI T&C when T&C link is clicked', async () => {
    fixture.debugElement.query(By.css('ion-text.link')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: LINKS.moonpayTransactionHistory });
  });

  it('should show informative modal of Moonpay provider when information-circle clicked', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
