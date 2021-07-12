import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemLicenseComponent } from './item-license.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ItemLicenseComponent', () => {
  let component: ItemLicenseComponent;
  let fixture: ComponentFixture<ItemLicenseComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemLicenseComponent],
        imports: [IonicModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemLicenseComponent);
      component = fixture.componentInstance;
      component.license = { type: 'premium' };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
