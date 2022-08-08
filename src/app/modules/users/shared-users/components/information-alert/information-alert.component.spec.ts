import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { InformationAlertComponent } from './information-alert.component';

describe('InformationAlertComponent', () => {
  let component: InformationAlertComponent;
  let fixture: ComponentFixture<InformationAlertComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InformationAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationAlertComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(),  TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.text = 'testText';
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('div.ia__information__text ion-text'));
    const imgEl = fixture.debugElement.query(By.css('div.ia__information img'));

    expect(textEl.nativeElement.innerHTML).toContain('testText');
    expect(imgEl.attributes['src']).toContain('assets/img/wallets/backup-information-circle.svg');
  });
});
