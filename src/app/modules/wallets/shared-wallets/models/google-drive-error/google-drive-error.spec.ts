import { GoogleDriveError } from './google-drive-error';

describe('GoogleDriveError', () => {
  let googleDriveError: GoogleDriveError;

  beforeEach(() => {
    googleDriveError = new GoogleDriveError({ error: 'popup_closed_by_user' });
  });

  it('new', () => {
    expect(googleDriveError).toBeTruthy();
  });

  it('value if pop up closed', () => {
    expect(googleDriveError.value()).toEqual('closed');
  });

  it('value if permission denied', () => {
    expect(new GoogleDriveError({ error: { error: { status: 'PERMISSION_DENIED' } } }).value()).toEqual('denied');
  });
});
