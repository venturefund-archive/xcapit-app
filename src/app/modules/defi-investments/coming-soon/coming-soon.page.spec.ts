import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComingSoonPage } from './coming-soon.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule} from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ComingSoonPage', () => {
  let component: ComingSoonPage;
  let fixture: ComponentFixture<ComingSoonPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ComingSoonPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ComingSoonPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
