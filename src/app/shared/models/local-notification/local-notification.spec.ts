import { LocalNotifications, LocalNotificationsPlugin } from '@capacitor/local-notifications';

class LocalNotification {
  constructor(
    private readonly _aTitle: string,
    private readonly _aBody: string,
    private readonly _aPlugin: LocalNotificationsPlugin = LocalNotifications
  ) {}

  async send() {
    await this._aPlugin.checkPermissions().then((status)=>{
        if(status.display === 'granted'){
            //this._aPlugin.schedule([{id:1, title: this._aTitle, body:this._aBody}])
        }
    })
  }
}

fdescribe('LocalNotification', () => {
  let localNotification: LocalNotification;

  beforeEach(() => {
    localNotification = new LocalNotification('testTitle', 'testBody', null);
  });

  it('new', () => {
    expect(localNotification).toBeTruthy();
  });

  it('send', ()=>{
    expect(localNotification.send).toBeTruthy();
  })
});
