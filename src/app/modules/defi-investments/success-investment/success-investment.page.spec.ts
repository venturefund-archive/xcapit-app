import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { SuccessInvestmentPage } from './success-investment.page';
import { ActivatedRoute, ParamMap } from '@angular/router';

describe('SuccessInvestmentPage', () => {
  let component: SuccessInvestmentPage;
  let fixture: ComponentFixture<SuccessInvestmentPage>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let paramMapSpy: jasmine.SpyObj<ParamMap>;
  beforeEach(
    waitForAsync(() => {
      paramMapSpy = jasmine.createSpyObj('ParamMap', { get: 'invest' });
      activatedRouteSpy = jasmine.createSpyObj(
        'ActivatedRoute',
        {},
        {
          snapshot: { paramMap: paramMapSpy },
        }
      );

      TestBed.configureTestingModule({
        declarations: [SuccessInvestmentPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessInvestmentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on will enter if add amount', () => {
    paramMapSpy.get.and.returnValue('add-amount');
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });

  it('should get data on will enter if invest', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });
});
