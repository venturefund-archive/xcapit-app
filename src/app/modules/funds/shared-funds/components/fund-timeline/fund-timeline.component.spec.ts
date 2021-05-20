import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FundTimelineComponent } from './fund-timeline.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';

describe('FundTimelineComponent', () => {
  let component: FundTimelineComponent;
  let fixture: ComponentFixture<FundTimelineComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundTimelineComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [FundTimelineComponent, TrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(FundTimelineComponent);
      component = fixture.componentInstance;
      component.fundName = 'testFundName';
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to Timeline Detail when goToDetail is executed', () => {
    const spy = spyOn(component, 'goToDetail');
    component.fundName = 'testFundName';
    component.runs = [{ id: 1, id_corrida: 1 }];
    fixture.detectChanges();
    component.goToDetail('1');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
