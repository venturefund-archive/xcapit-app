import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UrlSerializer } from '@angular/router';

import { ConnectionDetailPage } from './connection-detail.page';

describe('ConnectionDetailPage', () => {
  let component: ConnectionDetailPage;
  let fixture: ComponentFixture<ConnectionDetailPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConnectionDetailPage],
        imports: [IonicModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [UrlSerializer],
      }).compileComponents();

      fixture = TestBed.createComponent(ConnectionDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
