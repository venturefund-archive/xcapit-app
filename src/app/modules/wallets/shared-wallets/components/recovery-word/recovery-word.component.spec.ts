import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { RecoveryWordComponent } from './recovery-word.component';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('RecoveryWordComponent', () => {
  type NewType = RecoveryWordComponent;
  let component: NewType;
  let fixture: ComponentFixture<RecoveryWordComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryWordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecoveryWordComponent, FakeTrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryWordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when useValue called and clickable is true', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.clickable = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Recovery Word"]')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.isActivated).toBeFalsy();
  });

  it('should not emit event when useValue called and clickable is false', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.clickable = false;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Recovery Word"]')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(0);
    expect(component.isActivated).toBeTruthy();
  });
});
