import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HeaderProfileComponent } from './header-profile.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('HeaderProfileComponent', () => {
  let component: HeaderProfileComponent;
  let fixture: ComponentFixture<HeaderProfileComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HeaderProfileComponent>;

  beforeEach(waitForAsync(() => {
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
});
