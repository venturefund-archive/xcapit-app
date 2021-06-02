import { CurrencyFormatPipe } from './../../pipes/currency-format/currency-format.pipe';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FundCardComponent } from './fund-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../pipes/absolute-value/absolute-value.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { DecimalPipe } from '@angular/common';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { StrategyNamePipe } from '../../pipes/strategy-name/strategy-name.pipe';

describe('FundCardComponent', () => {
  let component: FundCardComponent;
  let fixture: ComponentFixture<FundCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundCardComponent>;
  let navControllerSpy: any;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;
  let storageMock: any;
  let storage: Storage;
  beforeEach(
    waitForAsync(() => {
      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        getHideFunds: () => Promise.resolve(true),
      };

      storageMock = {
        get: () => Promise.resolve(),
        set: () => Promise.resolve(),
        remove: () => Promise.resolve(),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [
          FundCardComponent,
          AbsoluteValuePipe,
          TrackClickDirective,
          DummyComponent,
          CurrencyFormatPipe,
          DecimalPipe,
          StrategyNamePipe,
        ],
        imports: [
          IonicModule,
          TranslateModule.forRoot(),
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([{ path: 'funds/detail/:fundName', component: DummyComponent }]),
        ],
        providers: [
          CurrencyFormatPipe,
          DecimalPipe,
          { provide: NavController, useValue: navControllerSpy },
          { provide: Storage, useValue: storageMock },
          { provide: LocalStorageService, useValue: localStorageServiceMock },
        ],
      }).compileComponents();

      localStorageService = TestBed.inject(LocalStorageService);
      storage = TestBed.inject(Storage);
      fixture = TestBed.createComponent(FundCardComponent);
      component = fixture.componentInstance;
      component.fund = { fund_name: 'Test' };
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SubscribeOnHideFunds on ngOnInit', () => {
    const spy = spyOn(component, 'subscribeOnHideFunds');
    fixture.detectChanges();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
