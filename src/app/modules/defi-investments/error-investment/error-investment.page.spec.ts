import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { ErrorInvestmentPage } from './error-investment.page';
import { ActivatedRoute, ParamMap } from '@angular/router';

describe('ErrorInvestmentPage', () => {
  let component: ErrorInvestmentPage;
  let fixture: ComponentFixture<ErrorInvestmentPage>;
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
        declarations: [ErrorInvestmentPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorInvestmentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on will enter with vault', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });

  it('should get data on will enter without vault', () => {
    paramMapSpy.get.and.returnValue(undefined);
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });
});
