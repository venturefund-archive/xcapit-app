import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from '../../../shared/services/track/track.service';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';
import { SuccessSubmodulesPage } from './success-submodules.page';


fdescribe('SuccessSubmodulesPage', () => {
  let component: SuccessSubmodulesPage;
  let fixture: ComponentFixture<SuccessSubmodulesPage>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  

  beforeEach(waitForAsync(() => {

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{
      trackEvent: Promise.resolve(true),
    })

    TestBed.configureTestingModule({
      declarations: [ SuccessSubmodulesPage ],  
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: TrackService, useValue: trackServiceSpy}
      ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessSubmodulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.event();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should set data on init', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.data).toEqual(SUCCESS_TYPES.success_submodules);
  });  

});
