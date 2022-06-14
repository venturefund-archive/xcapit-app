import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BackupInformationCardComponent } from './backup-information-card.component';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('BackupInformationCardComponent', () => {
  let component: BackupInformationCardComponent;
  let fixture: ComponentFixture<BackupInformationCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<BackupInformationCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BackupInformationCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(BackupInformationCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.text = 'testText';
    component.textClass = 'testUxHomeBackupCard';
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('div.bic__information__text ion-text'));
    const imgEl = fixture.debugElement.query(By.css('div.bic__information img'));

    expect(textEl.nativeElement.innerHTML).toContain('testText');
    expect(imgEl.attributes['src']).toContain('assets/img/wallets/backup-information-circle.svg');
  });

  it('should emit event on card click', () => {
    const spy = spyOn(component.cardClicked, 'emit');
    fixture.debugElement.query(By.css('.bic__information')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when card is clicked', () => {
    const el = fixture.debugElement.query(By.css('.bic__information'));
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
