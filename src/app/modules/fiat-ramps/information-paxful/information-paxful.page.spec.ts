import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationPaxfulPage } from './information-paxful.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('InformationPaxfulPage', () => {
  let component: InformationPaxfulPage;
  let fixture: ComponentFixture<InformationPaxfulPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InformationPaxfulPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot(), RouterTestingModule, ReactiveFormsModule],
      }).compileComponents();

      fixture = TestBed.createComponent(InformationPaxfulPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
