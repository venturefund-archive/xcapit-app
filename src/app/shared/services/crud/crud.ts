import { Observable } from 'rxjs';

export interface CRUD {
  create(data: any): Observable<any>;
  get(id: any): Observable<any>;
  update(data: any, id?: any): Observable<any>;
  delete(id: any): Observable<any>;
  getAll(options?: any): Observable<any>;
}
