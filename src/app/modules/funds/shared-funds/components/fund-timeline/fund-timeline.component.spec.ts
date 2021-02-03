import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FundTimelineComponent } from './fund-timeline.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FundTimelineComponent', () => {
  let component: FundTimelineComponent;
  let fixture: ComponentFixture<FundTimelineComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FundTimelineComponent, TrackClickDirective],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FundTimelineComponent);
    component = fixture.componentInstance;
    component.fundName = 'testFundName';
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
