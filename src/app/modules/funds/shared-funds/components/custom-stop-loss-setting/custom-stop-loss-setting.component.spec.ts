import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { CustomStopLossSettingComponent } from './custom-stop-loss-setting.component';

fdescribe('CustomStopLossSettingComponent', () => {
  let component: CustomStopLossSettingComponent;
  let fixture: ComponentFixture<CustomStopLossSettingComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CustomStopLossSettingComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [CustomStopLossSettingComponent, TrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [TrackClickDirective, { provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomStopLossSettingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Cancel Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Cancel');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Confirm Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
