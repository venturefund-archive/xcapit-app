import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundBalanceDetailComponent } from './fund-balance-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalController } from '@ionic/angular';

describe('FundBalanceDetailComponent', () => {
  let component: FundBalanceDetailComponent;
  let fixture: ComponentFixture<FundBalanceDetailComponent>;
  let modalControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundBalanceDetailComponent>;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', {
      create: Promise.resolve({
        present: () => Promise.resolve(),
        onWillDismiss: () => Promise.resolve({}),
        onDidDismiss: () => Promise.resolve({})
      }),
      dismiss: Promise.resolve()
    });
    TestBed.configureTestingModule({
      declarations: [FundBalanceDetailComponent, TrackClickDirective],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundBalanceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ModalController dismiss on close', async done => {
    component.close();
    fixture.whenStable().then(() => {
      expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call trackEvent on trackService when Close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Close'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
