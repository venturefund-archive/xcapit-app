import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { FundPortfolioCardComponent } from './fund-portfolio-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const testBalance = {
  balance: {
    balance_fin: 23,
    summary: []
  },
  fund: {
    currency: 'BTC'
  }
};

describe('FundPortfolioCardComponent', () => {
  let component: FundPortfolioCardComponent;
  let fixture: ComponentFixture<FundPortfolioCardComponent>;
  let apiFundsSpy: any;
  let modalControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundPortfolioCardComponent>;

  beforeEach(async(() => {
    apiFundsSpy = jasmine.createSpyObj('ApiFundsService', {
      getBalance: of(testBalance)
    });

    modalControllerSpy = jasmine.createSpyObj('ModalController', {
      create: Promise.resolve({
        present: () => Promise.resolve(),
        onWillDismiss: () => Promise.resolve({}),
        onDidDismiss: () => Promise.resolve({})
      }),
      dismiss: Promise.resolve()
    });
    TestBed.configureTestingModule({
      declarations: [FundPortfolioCardComponent, TrackClickDirective],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsSpy },
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundPortfolioCardComponent);
    component = fixture.componentInstance;
    component.fundBalance = testBalance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setTotal on init', () => {
    const spy = spyOn(component, 'setTotal');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call setCurrency on init', () => {
    const spy = spyOn(component, 'setCurrency');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call orderChartData on init', () => {
    const spy = spyOn(component, 'orderChartData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call ModalController create on changeCurrency', async done => {
    component.changeCurrency();
    fixture.whenStable().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call ModalController create on viewDetails', async done => {
    component.viewDetails();
    fixture.whenStable().then(() => {
      expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call trackEvent on trackService when Change Currency is clicked', async done => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Change Currency'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call trackEvent on trackService when View Details is clicked', async done => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'View Details'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyClickEvent).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
