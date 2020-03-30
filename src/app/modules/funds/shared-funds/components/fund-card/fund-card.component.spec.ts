import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FundCardComponent } from './fund-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '../../pipes/absolute-value/absolute-value.pipe';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';

describe('FundCardComponent', () => {
  let component: FundCardComponent;
  let fixture: ComponentFixture<FundCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundCardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FundCardComponent,
        AbsoluteValuePipe,
        TrackClickDirective,
        DummyComponent
      ],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'funds/detail/:fundName', component: DummyComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundCardComponent);
    component = fixture.componentInstance;
    component.fund = { fund_name: 'Test' };
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when View Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'View Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
