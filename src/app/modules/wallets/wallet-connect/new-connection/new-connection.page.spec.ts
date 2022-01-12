import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { NewConnectionPage } from './new-connection.page';

describe('NewConnectionPage', () => {
  let component: NewConnectionPage;
  let fixture: ComponentFixture<NewConnectionPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewConnectionPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [UrlSerializer],
      }).compileComponents();

      fixture = TestBed.createComponent(NewConnectionPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
