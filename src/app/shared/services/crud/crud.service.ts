import { Injectable } from '@angular/core';
import { CustomHttpService } from '../custom-http/custom-http.service';
import { CRUD } from './crud';
import { API_URL } from 'src/app/config/app-constants.config';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: CustomHttpService) {}

  getEndpoints(entity: string): CRUD {
    return {
      create: (data: any) => this.http.post(`${API_URL}/${entity}`, data),
      get: (id: any) => this.http.get(`${API_URL}/${entity}/${id}`),
      update: (data: any, id?: any) =>
        this.http.put(`${API_URL}/${entity}/${data.id || id}`, data),
      delete: (id: any) => this.http.delete(`${API_URL}/${entity}/${id}`),
      getAll: (options?: any) => this.http.get(`${API_URL}/${entity}`, '', options)
    };
  }
}
