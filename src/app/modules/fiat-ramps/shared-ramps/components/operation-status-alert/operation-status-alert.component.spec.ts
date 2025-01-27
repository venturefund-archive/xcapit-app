import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { OperationStatusAlertComponent } from './operation-status-alert.component';
import { TrackService } from 'src/app/shared/services/track/track.service';

describe('OperationStatusAlertComponent', () => {
  let component: OperationStatusAlertComponent;
  let fixture: ComponentFixture<OperationStatusAlertComponent>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    TestBed.configureTestingModule({
      declarations: [OperationStatusAlertComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: TrackService, useValue: trackServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationStatusAlertComponent);
    component = fixture.componentInstance;
    component.operationStatus = 'wait';
    component.operationType = 'cash-in';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show text according to wait status', () => {
    component.operationStatus = 'wait';
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.osa__information__text > ion-text')).nativeElement.textContent;
    const cssClassEl = fixture.debugElement.query(By.css('.ux-warning-background-card'));

    expect(textEl).toContain('fiat_ramps.kripton_operation_detail.state_toast.cash-in.incomplete');
    expect(textEl).toContain('fiat_ramps.kripton_operation_detail.state_toast.cash-in.incomplete2');
    expect(cssClassEl).toBeTruthy();
  });

  it('should show text according to cancel status', () => {
    component.operationStatus = 'cancel';
    component.ngOnInit();
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('.osa__information__text > ion-text')).nativeElement.textContent;
    const cssClassEl = fixture.debugElement.query(By.css('.ux-danger-background-card'));

    expect(textEl).toContain('fiat_ramps.kripton_operation_detail.state_toast.cash-in.cancelled');
    expect(cssClassEl).toBeTruthy();
  });

  it('should track event on cash-out and operation on wait status when osa__information is clicked', () => {
    component.operationStatus = 'wait';
    component.operationType = 'cash-out';
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div[name="Information card"]')).nativeElement.click();

    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
