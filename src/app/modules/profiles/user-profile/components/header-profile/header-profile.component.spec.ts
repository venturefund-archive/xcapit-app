import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HeaderProfileComponent } from './header-profile.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('HeaderProfileComponent', () => {
  let component: HeaderProfileComponent;
  let fixture: ComponentFixture<HeaderProfileComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HeaderProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderProfileComponent, TrackClickDirective],
      imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Skipped until enable edit photo button, now is hidden.
  // xit('should call trackEvent on trackService when Edit Profile Photo button clicked', () => {
  //   component.editing = true;
  //   fixture.detectChanges();
  //   const el = trackClickDirectiveHelper.getByElementByName(
  //     'ion-button',
  //     'Edit Profile Photo'
  //   );
  //   const directive = trackClickDirectiveHelper.getDirective(el);
  //   const spy = spyOn(directive, 'clickEvent');
  //   el.nativeElement.click();
  //   fixture.detectChanges();
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });
});
