import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-share-education',
  template: `
    <div *ngIf="this.canShare" class="se" (click)="this.share()">
      <img src="/assets/img/financial-education/shared-financial-education/share.svg" />
    </div>
  `,
  styleUrls: ['./share-education.component.scss'],
})
export class ShareEducationComponent implements OnInit {
  asset: string;
  public canShare: boolean;
  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await Promise.all([this.loadAsset(), this.isNativePlatform()]);
  }

  async isNativePlatform(): Promise<void> {
    this.canShare = (await Share.canShare()).value;
  }

  async setBlob() {
    const blob = await this.http
      .get('/assets/img/financial-education/shared-financial-education/share-image.jpg', { responseType: 'blob' })
      .toPromise();
    return blob;
  }

  async loadAsset() {
    const blob = await this.setBlob();

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const result = reader.result as string;
      this.asset = result.split(',')[1];
    };
  }

  async share() {
    const fileName = new Date().getTime() + '.jpg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Cache,
      path: fileName,
      data: this.asset,
    });

    await Share.share({
      title: 'Share Xcapit',
      text: '',
      url: savedFile.uri,
      dialogTitle: 'Share',
    });
  }
}
