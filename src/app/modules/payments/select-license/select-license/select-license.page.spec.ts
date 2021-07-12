import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectLicensePage } from './select-license.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('SelectLicensePage', () => {
  let component: SelectLicensePage;
  let fixture: ComponentFixture<SelectLicensePage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectLicensePage],
        imports: [IonicModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectLicensePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
