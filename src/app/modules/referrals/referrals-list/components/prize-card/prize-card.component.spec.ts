import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { PrizeCardComponent } from './prize-card.component';

describe('PrizeCardComponent', () => {
  let component: PrizeCardComponent;
  let fixture: ComponentFixture<PrizeCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PrizeCardComponent>;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [PrizeCardComponent, TrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();
      fixture = TestBed.createComponent(PrizeCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Send Email Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Send Email');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call sendEmail when Send Email Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Send Email');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(component, 'sendEmail');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
