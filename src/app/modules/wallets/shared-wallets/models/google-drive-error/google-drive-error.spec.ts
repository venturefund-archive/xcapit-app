import { GoogleDriveError } from './google-drive-error';

describe('GoogleDriveError', () => {
  let googleDriveError: GoogleDriveError;

  beforeEach(() => {
    googleDriveError = new GoogleDriveError({ type: 'userLoggedOut' });
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

  it('value if is not one', () => {
    expect(new GoogleDriveError({ type: 'anotherError' }).value()).toEqual('generic');
  });

  it('value if is an error ocurred ', () => {
    expect(new GoogleDriveError({ error_type: 'anError' }).value()).toEqual('generic');
  });
});
