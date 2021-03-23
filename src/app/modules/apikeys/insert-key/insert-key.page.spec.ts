import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertKeyPage } from './insert-key.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

const formData = {
  valid: {
    api_key: 'some_large_test_key',
  },
  invalid: {
    api_key: '',
  },
};
describe('InsertKeyPage', () => {
  let component: InsertKeyPage;
  let fixture: ComponentFixture<InsertKeyPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InsertKeyPage>;
  let storageApikeysServiceSpy;
  let navControllerSpy: any;
  beforeEach(waitForAsync(() => {
    storageApikeysServiceSpy = jasmine.createSpyObj('StorageApikeysService', [
      'updateData',
    ]);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [InsertKeyPage, TrackClickDirective, DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/tutorial', component: DummyComponent },
          { path: 'apikeys/insert-key', component: DummyComponent },
          { path: 'apikeys/insert-secret', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        TrackClickDirective,
        { provide: StorageApikeysService, useValue: storageApikeysServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    storageApikeysServiceSpy = TestBed.inject(StorageApikeysService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateData on handleSubmit and valid form', () => {
    fixture.detectChanges();
    storageApikeysServiceSpy.updateData.and.returnValue({});
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(storageApikeysServiceSpy.updateData).toHaveBeenCalledTimes(1);
  });

  it('should not call updateData on handleSubmit and invalid form', () => {
    fixture.detectChanges();
    storageApikeysServiceSpy.updateData.and.returnValue({});
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(storageApikeysServiceSpy.updateData).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Next'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
