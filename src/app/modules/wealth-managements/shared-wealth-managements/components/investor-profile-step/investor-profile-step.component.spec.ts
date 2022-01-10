import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { InvestorProfileStepComponent } from './investor-profile-step.component';

describe('InvestorProfileStepComponent', () => {
  let component: InvestorProfileStepComponent;
  let fixture: ComponentFixture<InvestorProfileStepComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestorProfileStepComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvestorProfileStepComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestorProfileStepComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Select Profile clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Select Profile');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event on Select Profile click', () => {
    const spy = spyOn(component.setProfileEvent, 'emit');
    component.baseScore = 4;
    fixture.debugElement.query(By.css('ion-button[name="Select Profile"]')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledOnceWith(4);
  });
});
