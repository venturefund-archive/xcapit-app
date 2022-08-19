import { Injectable } from '@angular/core';
import { CustomHttpService } from '../custom-http/custom-http.service';
import { CRUD } from './crud';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private http: CustomHttpService) {}

  getEndpoints(entity: string): CRUD {
    return {
      create: (data: any) => this.http.post(`${environment.apiUrl}/${entity}/`, data),
      get: (id?: any) => this.http.get(`${environment.apiUrl}/${entity}/${id || ''}`),
      update: (data: any, id?: any) => this.http.put(`${environment.apiUrl}/${entity}/${data.id || id || ''}`, data),
      delete: (id: any) => this.http.delete(`${environment.apiUrl}/${entity}/${id}`),
      getAll: (options?: any) => this.http.get(`${environment.apiUrl}/${entity}/`, '', options),
      patch: (data: any, id?: any) => this.http.patch(`${environment.apiUrl}/${entity}/${data.id || id || ''}`, data),
    };
  }
}
