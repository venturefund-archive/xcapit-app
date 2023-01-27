import { ContactDataService} from './contact-data.service';
import { TestBed } from '@angular/core/testing';
import { Contact } from '../../interfaces/contact.interface';

describe('ContactDataService', () => {
  let contact : Contact;
  let service: ContactDataService;

  beforeEach(() => {
    contact = {
      name: 'TestName',
      address:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep',
      networks:['MATIC']
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    
  });

  it('should store contacts data', () => {
    service.contact = contact; 

    expect(service.contact.address).toEqual('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep');
    expect(service.contact.networks).toEqual(['MATIC']);
    expect(service.contact.name).toEqual('TestName');
  });

  it('should update and access data', () => {
    service.updateContact(contact);
    expect(service.getContact()).toEqual(contact);
  });
});
