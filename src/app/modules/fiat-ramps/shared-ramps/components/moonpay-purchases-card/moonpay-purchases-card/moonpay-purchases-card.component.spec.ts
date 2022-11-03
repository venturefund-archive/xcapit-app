import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { MoonpayPurchasesCardComponent } from './moonpay-purchases-card.component';

describe('MoonpayPurchasesCardComponent', () => {
  let component: MoonpayPurchasesCardComponent;
  let fixture: ComponentFixture<MoonpayPurchasesCardComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [MoonpayPurchasesCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
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
});
