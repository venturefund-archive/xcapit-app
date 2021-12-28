import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';

import { OperationDetailPage } from './operation-detail.page';

describe('OperationDetailPage', () => {
  let component: OperationDetailPage;
  let fixture: ComponentFixture<OperationDetailPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OperationDetailPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [UrlSerializer],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
