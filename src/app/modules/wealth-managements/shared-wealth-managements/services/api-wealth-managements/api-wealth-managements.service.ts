import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'src/environments/environment';

export interface Answer {
  text: string;
  points: number;
}
export interface Question {
  text: string;
  order: number;
  options: Answer[];
}
@Injectable({
  providedIn: 'root',
})
export class ApiWealthManagementsService {
  crud: CRUD;

  entity = 'surveys';
  env = environment.environment;
  constructor(private crudService: CrudService, private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getInvestorTestQuestions(): Observable<Question[]> {
    return this.http.get(`${environment.apiUrl}/${this.entity}/investor_test`, undefined, undefined, true);
  }
}
