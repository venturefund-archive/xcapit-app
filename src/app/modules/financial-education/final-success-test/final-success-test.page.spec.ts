import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FinalSuccessTestPage } from './final-success-test.page';
import { By } from '@angular/platform-browser';

const testData = {
  image:"assets/img/financial-education/test.svg",
    textPrimary: 'financial_education.final_success_test.textPrimary', 
    textSecondary:'financial_education.final_success_test.textSecondary',
    namePrimaryAction: 'financial_education.final_success_test.primaryButton',
    urlPrimaryAction:'/financial-education/home',
    trackClickEventNamePrimaryAction: 'ux_education_finalize'
}

describe('FinalSuccessTestPage', () => {
  let component: FinalSuccessTestPage;
  let fixture: ComponentFixture<FinalSuccessTestPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{ trackEvent: Promise.resolve(true),})
    TestBed.configureTestingModule({
      declarations: [ FinalSuccessTestPage ],
      imports: [IonicModule.forRoot()],
      providers:[{ provide: TrackService, useValue: trackServiceSpy}],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

    fixture = TestBed.createComponent(FinalSuccessTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.data = testData;
    const appErrorContentEl = fixture.debugElement.query(By.css('app-success-content'));
    expect(appErrorContentEl).toBeTruthy();
  });


  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should render app-share-education component', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const componentEl = fixture.debugElement.queryAll(By.css('app-share-education'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });
  
});
