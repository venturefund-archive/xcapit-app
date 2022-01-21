import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundOperationsHistoryComponent } from './fund-operations-history.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocalizedDatePipe } from 'src/app/shared/pipes/localized-date/localized-date.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
const testOperations = [
  { id_corrida: 1, fecha_inicio: '2019-08-08T15:25:16.489000Z' },
  { id_corrida: 2, fecha_inicio: '2019-09-08T15:25:16.489000Z' },
  { id_corrida: 3, fecha_inicio: '2019-10-08T15:25:16.489000Z' },
];

describe('FundOperationsHistoryComponent', () => {
  let component: FundOperationsHistoryComponent;
  let fixture: ComponentFixture<FundOperationsHistoryComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundOperationsHistoryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FundOperationsHistoryComponent, LocalizedDatePipe, FakeTrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [DatePipe],
      }).compileComponents();

      fixture = TestBed.createComponent(FundOperationsHistoryComponent);
      component = fixture.componentInstance;
      component.operations = testOperations;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when View Run Details is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'View Run Details');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
