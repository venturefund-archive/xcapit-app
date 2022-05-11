import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SuccessPagePage } from './success-page.page';
import { TranslateModule } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';


fdescribe('SuccessPagePage', () => {
  let component: SuccessPagePage;
  let fixture: ComponentFixture<SuccessPagePage>;
  
  beforeEach(
    waitForAsync(() => {
        TestBed.configureTestingModule({
        declarations: [SuccessPagePage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, TranslateModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should set data on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.data).toEqual(SUCCESS_TYPES.success_fiat_ramps);
  });

});
