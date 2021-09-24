import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

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

  it('should call appTrackEvent on trackService when Recovery Word clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Recovery Word');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event when useValue called and clickable is true', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.clickable = true;
    fixture.detectChanges();
    component.useValue('');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.isActivated).toBeFalsy();
  });

  it('should not emit event when useValue called and clickable is false', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.clickable = false;
    fixture.detectChanges();
    component.useValue('');
    expect(spy).toHaveBeenCalledTimes(0);
    expect(component.isActivated).toBeTruthy();
  });
});
