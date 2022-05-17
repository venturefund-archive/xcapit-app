import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ReferralsComingComponent } from './referrals-coming.component';

describe('ReferralsComingComponent', () => {
  let component: ReferralsComingComponent;
  let fixture: ComponentFixture<ReferralsComingComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [ ReferralsComingComponent,  ],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()],
      providers:[{ provide: BrowserService, useValue: browserServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralsComingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should naviagate to ToS on button click', () => {
    const el = fixture.debugElement.query(By.css('.rc__tos a'));
    el.nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://xcapit.com/financial-freedom-tyc/' });
  });


  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.rc__img img'));
    const titleEl = fixture.debugElement.query(By.css('.rc__title ion-text'));
    const paragraphEl = fixture.debugElement.query(By.css('.rc__paragraph ion-text'));
    const linkEl = fixture.debugElement.query(By.css('.rc__tos a'));

    expect(imgEl.attributes.src).toContain('assets/img/referrals/referrals-coming/referrals-magic.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('referrals.referrals_coming.title');
    expect(paragraphEl.nativeElement.innerHTML).toContain('referrals.referrals_coming.paragraph');
    expect(linkEl).toBeTruthy();
  });

});
