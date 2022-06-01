import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

import { ErrorRecoveryWalletPage } from './error-recovery-wallet.page';

describe('ErrorRecoveryWalletPage', () => {
  let component: ErrorRecoveryWalletPage;
  let fixture: ComponentFixture<ErrorRecoveryWalletPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(
    waitForAsync(() => {
      trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
        trackEvent: Promise.resolve(true),
      })
      
      TestBed.configureTestingModule({
        declarations: [ErrorRecoveryWalletPage],
        imports: [IonicModule.forRoot()],
        providers: [{ provide: TrackService, useValue: trackServiceSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(ErrorRecoveryWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
