import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FundFinishedCardComponent } from './fund-finished-card.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FundDataStorageService } from '../../../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

describe('FundFinishedCardComponent', () => {
  let component: FundFinishedCardComponent;
  let fixture: ComponentFixture<FundFinishedCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundFinishedCardComponent>;
  let fundDataStorageServiceMock: any;
  let fundDataStorageService: any;
  let navControllerSpy: any;

  beforeEach(waitForAsync(() => {
    fundDataStorageServiceMock = {
      setData: () => Promise.resolve()
    };
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    TestBed.configureTestingModule({
      declarations: [ 
        FundFinishedCardComponent,
        TrackClickDirective,
        DummyComponent
      ],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'funds/fund-risk', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: FundDataStorageService, useValue: fundDataStorageServiceMock },
        { provide: NavController, useValue: navControllerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundFinishedCardComponent);
    component = fixture.componentInstance;
    component.fund = {nivel_de_riesgo: "Test"};
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dataStorageService.setData on click', async done => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.renewFund();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(2));
    done();
  });

  it('should call trackEvent on trackService when Renovate Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Renovate Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Delete Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Delete Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
