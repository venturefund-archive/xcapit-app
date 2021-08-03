import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { RecoveryPhrasePage } from './recovery-phrase.page';

describe('RecoveryPhrasePage', () => {
  let component: RecoveryPhrasePage;
  let fixture: ComponentFixture<RecoveryPhrasePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhrasePage>;
  let navController: NavController;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecoveryPhrasePage, TrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerMock }],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhrasePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      navController = TestBed.inject(NavController);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Next clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shuld go to verify phrase when goToVerifyPhrase called', () => {
    const spy = spyOn(navController, 'navigateForward');
    component.goToVerifyPhrase();
    expect(spy).toHaveBeenCalledWith(['/wallets/create-first/verify-phrase']);
  });
});
